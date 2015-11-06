#!/usr/bin/env python
# -*- coding: utf-8 -*-
import xml.etree.cElementTree as ET
import pprint
import re
import codecs
import json
from pymongo import MongoClient
"""
Your task is to wrangle the data and transform the shape of the data
into the following json model:

{
"id": "2406124091",
"type: "node",
"visible":"true",
"created": {
          "version":"2",
          "changeset":"17206049",
          "timestamp":"2013-08-03T16:43:42Z",
          "user":"linuxUser16",
          "uid":"1219059"
        },
"pos": [41.9757030, -87.6921867],
"address": {
          "housenumber": "5157",
          "postcode": "60625",
          "street": "North Lincoln Ave"
        },
"amenity": "restaurant",
"cuisine": "mexican",
"name": "La Cabana De Don Luis",
"phone": "1 (773)-271-5176"
}

Things to do:
[X] Consistently format telfs and faxes. 
[X] Consistenly change street abbr.
[X] Start all URLs with http not www. or anything.
[X] Move phone, fax, email, url and social media to contact (https://wiki.openstreetmap.org/wiki/Key:contact)
[X] Insert into DB

EXCEPTION! There is some bad entered data, with the only key 'address'.
I'm gonna assume it's address:street
"""

# MongoDB initialization
client = MongoClient('mongodb://127.0.0.1/', 27017)
db = client.osm.barcelona

# Helper functions

# See if data is problematic
def isProblematic(tag, value):
  #lower = re.compile(r'^([a-z]|_)*$')
  lower_colon = re.compile(r'^([a-z]|_)*:([a-z]|_)*$')
  problemchars = re.compile(r'[=\+/&<>;\'"\?%#$@\,\. \t\r\n]')
  for variable in locals():
    if problemchars.findall(variable) or lower_colon.findall(variable):
      return True
  return False

# Create a subdictionary
def createSubDict(dict,subDict):
  if not subDict in dict:
    dict[subDict] = {}

# Reshape a tag so that it's included in a category
# TO DO: I know that maybe I should be writing this functions so that
# it has return values and not like that.
def reshapeCategory(dictionary, category, tag, value):
  createSubDict(dictionary, category)
  # First level reshaping (phone = *)
  if len(tag.split(':')) == 1:
    dictionary[category][tag] = value
  # Seonc level ( contact:phone = *)
  elif len(tag.split(':')) == 2:
    subCategory = tag.split(':')[1]
    # Street fix!
    if subCategory == 'street':
      value = fixStreet(value)
    dictionary[category][subCategory] = value

# Reshape url, let's change it for something more specific
def reshapeUrl(tag, value):
  # Let's start all urls with http (or https)
  if not value.startswith('http'):
    value = 'http://' + value
  # List of specific contact types. Let's omit G+. Nobody uses G+.
  specificUrl = ['facebook', 'twitter', 'linkedin', 'instagram', 'diaspora', 'xing']
  for page in specificUrl:
    if page in value:
      return page
  # If we cannot assign a specifc url, let it under website
  else:
    return 'website'

# Consistently format phone and fax numbers
def formatPhoneNumber(number):
  itnlCode = '+34'
  numbers = re.split('\; |, |/ |-\.', number)
  formattedNumbers = []
  for number in numbers:
    # Strip parentheses, dashes, spaces, whatever
    number = number.translate(None, "()[]{}.- ")
    # Spanish phones, faxes, and mobiles are 9 number long, so we have to append the int code
    if len(number) == 9:
      number = itnlCode + number
    # Account for people that put the 34 intl code but not the + sign
    if len(number) == 11 and number.startswith(itnlCode[1:]):
      number = '+' + number
    # Account for people that put a 0 or 00 and not the + sign
    if len(number) == 12 and number.startswith('0'):
      number = '+' + number[1:]
    if len(number) == 13 and number.startswith('00'):
      number = '+' + number[2:]
    # Now: Spanish mobile phones start with 6. 
    # Regional Catalan and some special numbers start with 9.
    # Ignore the rest.
    if len(number) == 12 and number[3] == '9':
      number = number[0:3] + ' ' + number[3:5] + ' ' + number[5:]
    if len(number) == 12 and number[3] == '6':
      number = number[0:3] + ' ' + number[3:6] + ' ' + number[6:]
    # Ignore user entered bad data
    if len(number) == 3 or len(number) == 14:
      formattedNumbers.append(number)
  return formattedNumbers

# Fix the street values.
# We have special problems here:
# 1.- Language. Some are in catalan, some in spanish. 
#   I'll settle for catalan, as it's how the street names are officially
#   written in Barcelona
# 2.- Upper and Lower cases are tricky: "de, el, els, les, la, d'..." should not 
#   be capitalized. Leaving that for a next iteration

# Expected Values
expectedStreetTypes = ['Carrer', 'Carretera', u'Plaça', 'Avinguda', 'Ronda', 'Can', 'Rambla', 'Ca', 'Travessera', 'Via', 'Passatge', 'Passeig', 'Placeta', 'Autopista', 'Riera', u'Camí']

# Typical mistaken and spanish Street Types
typicalStreetTypesErrors = {
  'C/': 'Carrer',
  'C': 'Carrer',
  'Cr': 'Carrer',
  'Cl': 'Carrer',
  'Calle': 'Carrer',
  'Rbla': 'Rambla',
  'Av': 'Avinguda',
  'Avda': 'Avinguda',
  'Avenida': 'Avinguda',
  'Ctra' : 'Carretera',
  'Pl': u'Plaça',
  'Plaza': u'Plaça',
  'Pg': 'Passeig',
  'Pso': 'Passeig',
  'Paseo': 'Passeig'
}

def fixStreet(value):
  value = unicode(value)
  streetType = value.split('.')[0]
  streetType = streetType.split()[0]
  streetType = streetType.lower().capitalize()
  if not streetType in expectedStreetTypes:
    if typicalStreetTypesErrors.has_key(streetType):
      value = value.replace(streetType, typicalStreetTypesErrors[streetType], 1)
  return value
  
# Helper lists to categorize
CREATED = [ "version", "changeset", "timestamp", "user", "uid"]
CONTACT = ['phone', 'fax', 'email', 'website', 'facebook', 'twitter', 'linkedin', 'google_plus', 'instagram', 'diaspora', 'xing', 'webcam', 'vhf']

def shape_element(element):
    node = {}
    # As in the last exercise, this time we only care about nodes and ways
    if element.tag == "node" or element.tag == "way" :
      # Get the type of the node
      node['type'] = element.tag
      # If the tag has lat and long, array them in pos
      try:
        node['pos'] = [float(element.attrib['lat']), float(element.attrib['lon'])]
      except:
        pass
      # For every tag
      for tag in element.attrib:
        value = element.attrib[tag]
        # Discard problematic keys and values
        if not isProblematic(tag, value):
          # Group the tags under created
          if tag in CREATED:
            reshapeCategory(node, 'created', tag, value)
          # We already took care of those two
          elif tag == 'lat' or tag == 'lon':
            pass
          # Rest of attributes
          else:
            node[tag] = value

      # Get the subElements inside each element
      for subElement in element.iter('tag'):
        key = subElement.attrib['k']
        value = subElement.attrib['v']
        if not isProblematic(key, value):
          # Reshape the urls
          if key == 'url' or key == 'website':
            key = 'contact:' + reshapeUrl(key, value)
          # Address fix
          if key == 'address':
            key = 'addr:street'
          # Now it's time to categorize
          # If it starts with addr:
          if key.startswith('addr:'):
            reshapeCategory(node, 'address', key, value)
          # Group the tags under contact
          elif key in CONTACT or key.startswith('contact:'):
            if key == 'fax' or key == 'phone':
              value = formatPhoneNumber(value)
            reshapeCategory(node, 'contact', key, value)
          # Put all the rest tags into the dictionary       
          else:
            node[key] = value
        
      # Way specific array
      if element.tag == "way":
        for nd in element.iter('nd'):
          if 'node_refs' in node:
            pass
          else:
            node['node_refs'] = []
          node['node_refs'].append(nd.attrib['ref'])
      return node
    else:
      return None

def process_map(file_in, pretty = False):
    # You do not need to change this file
    file_out = "{0}.json".format(file_in)
    data = []
    with codecs.open(file_out, "w") as fo:
        for _, element in ET.iterparse(file_in):
            el = shape_element(element)
            if el:
                data.append(el)
                if pretty:
                    fo.write(json.dumps(el, indent=2)+"\n")
                else:
                    fo.write(json.dumps(el) + "\n")
                    # Insert into the database!
                    db.insert(el)
    return data

if __name__ == "__main__":
  data = process_map('barcelona_spain.osm', False)