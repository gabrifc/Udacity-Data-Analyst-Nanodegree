#!/usr/bin/python
'''
Note: I have reordered the steps to for a better logical flow.
'''
import sys
import pickle
import matplotlib.pyplot
import operator
sys.path.append("../tools/")

from feature_format import featureFormat, targetFeatureSplit
from tester import dump_classifier_and_data

def dataCleaning(dictionary, numberUsefulFeatures):
  '''
  Input: dictionary of Enron employees with financial and email features.
  Output: dictionary with the entries with at least X valid features.
  '''
  print 'Cleaning data:'
  # Initialize the list of the values that we'll delete
  removeEntries = []
  # Get the useful values for each employee in a dictionary
  usefulDict = {}
  numberOfFeatures = len(dictionary[dictionary.keys()[0]].keys())
  for employee in dictionary:
    # Get the number of keys with NaN value
    numberNaN = 0
    for key in dictionary[employee]:
      if dictionary[employee][key] == 'NaN':
        numberNaN += 1
    # The useful features are the ones that are not NaN
    # I also rest the poi entries, as it's not useful for the prediction
    usefulDict[employee] = numberOfFeatures - numberNaN - 1

  # Append the entries with less than 5 useful values to the outlier list
  for employee in usefulDict:
    if usefulDict[employee] < numberUsefulFeatures:
      removeEntries.append(employee)
  
  # Actually delete the entries from the dictionary. 
  # Could have done it before but I feel it's cleaner this way.
  for entry in removeEntries:
    dictionary.pop(entry,0)

  # Return the dictionary.
  print 'Removed', len(removeEntries), 'entries,', 
  print len(dictionary), 'entries left.'
  return dictionary

# Get the data
data_dict = pickle.load(open("final_project_dataset.pkl", "r") )

# Task 1: Remove outliers and clean the data
outliers = ['TOTAL', 'THE TRAVEL AGENCY IN THE PARK']
for outlier in outliers:
  data_dict.pop(outlier,0)
data_dict = dataCleaning(data_dict, 2)

# Task 2: Create new features that we'll use in the analysis, 
# and delete features that we will not use.

'''
## Count feature values in dictionary to analyze bias.
for feature in features_list:
  featureTotal = 0
  featureNoPOI = 0
  featurePOI = 0
  for employee in data_dict:
    if data_dict[employee][feature] > 0:
      featureTotal += 1
      if data_dict[employee]['poi'] == True:
        featurePOI += 1
      else:
        featureNoPOI += 1
  featureTotal = round(float(featureTotal)/len(data_dict), 2)
  featureNoPOI = round(featureNoPOI/(len(data_dict) - 18.), 2)
  featurePOI = round(featurePOI/18., 2)
  print feature, '\t', featureTotal, '\t', featureNoPOI, \t', featurePOI
'''

# unnededFeatures contains the features too biased to use in the analysis
# and the ones I replaced with custom created. Plus email address.
unnededFeatures = ['email_address', 'restricted_stock_deferred',
  'director_fees', 'loan_advances', 'restricted_stock',
  'long_term_incentive', 'shared_receipt_with_poi', 'from_poi_to_this_person']

for employee in data_dict:
  '''
  # Features that DECREASED the F1
  data_dict[employee]['proportion_stock_exercised'] = float(
    data_dict[employee]['exercised_stock_options']) / float(
    data_dict[employee]['total_stock_value'])
  data_dict[employee]['proportion_bonus'] = float(
    data_dict[employee]['bonus']) / float(
    data_dict[employee]['total_payments'])
  '''
  # Email Features
  data_dict[employee]['sharing_importance'] = float(
    data_dict[employee]['shared_receipt_with_poi']) / float(
    data_dict[employee]['to_messages'])
  data_dict[employee]['proportion_received_from_poi'] = float(
    data_dict[employee]['from_poi_to_this_person']) / float(
    data_dict[employee]['to_messages'])
  # Finance features
  data_dict[employee]['proportion_restricted_stock'] = float(
    data_dict[employee]['restricted_stock']) / float(
    data_dict[employee]['total_stock_value'])
  data_dict[employee]['proportion_long_term_incentive'] = float(
    data_dict[employee]['long_term_incentive']) / float(
    data_dict[employee]['total_payments'])
  # Task 2.1: Delete unneeded and not applicable features:
  for feature in unnededFeatures:
    data_dict[employee].pop(feature)

# Task 2.2: Scale features and change NaNs to 0 to use with Scikit Learn
for feature in data_dict[data_dict.keys()[0]].keys():
  if feature != 'poi':
    # Create a list to store the values
    featureScaler = []
    for employee in data_dict:
      # If it's NaN or nan (because of the above computations), change to 0.
      if str(data_dict[employee][feature]).lower() == 'nan':
        data_dict[employee][feature] = 0
      # Append the values to the list
      featureScaler.append(float(data_dict[employee][feature]))

    # Fit the scaler
    from sklearn import preprocessing
    minMaxScaler = preprocessing.MinMaxScaler()
    minMaxScaler.fit(featureScaler)

    # Transform the dictionary values
    for employee in data_dict:
      data_dict[employee][feature] = minMaxScaler.transform(
        [float(data_dict[employee][feature])])


# Task 3: Select the features we'll use. The first feature must be 'poi'.

'''
# All features to use with PCA & SelectKBest
features_list = data_dict[data_dict.keys()[0]].keys()
# Remove poi and from_this_person_to_poi from the list. from_this_person_to_poi
# decreased the F1 score.
removeFeatures = ['poi', 'from_this_person_to_poi']
for removedFeature in removeFeatures:
  features_list.remove(removedFeature)
# Insert poi as the first one.
features_list.insert(0, 'poi')
'''

# Final hand-picked features. Selection explained in the project questions.
features_list = ['poi', 'proportion_long_term_incentive', 'from_messages', 
  'bonus', 'proportion_received_from_poi', 'sharing_importance']

'''
# Create Feature Combinations to Brute-force:
from itertools import combinations
combination_list = combinations(features_list, 3)
maxF1 = 0
bestFeatures = ()
for combination in combination_list:
  features_list = ['poi']
  for feature in combination:
    features_list.append(feature)
# And for loop the rest of the file.
'''

# Store to my_dataset for easy export below.
my_dataset = data_dict

# Extract features and labels from dataset for local testing
data = featureFormat(my_dataset, features_list, sort_keys = True)
labels, features = targetFeatureSplit(data)

from sklearn.cross_validation import train_test_split
features_train, features_test, labels_train, labels_test = \
    train_test_split(features, labels, test_size=0.3, random_state=42)

'''
## Get an initial grasp on feature importance using Decision Tree
from sklearn.tree import DecisionTreeClassifier
clf = DecisionTreeClassifier(random_state = 0)
clf.fit(features, labels)
featureScores = zip(features_list[1:],clf.feature_importances_)
for item in featureScores:
  print item[0], '\t', item[1]

# Implement SelectKBest to get the 'best' features
from sklearn.feature_selection import SelectKBest, f_classif
selection = SelectKBest(f_classif, k = 11)
selection.fit_transform(features, labels)
# See which features were selected
for index in selection.get_support(indices=True).tolist():
  print features_list[index]

# Implement PCA
from sklearn.decomposition import PCA
pca = PCA(n_components = 6, whiten = False)

# Mix best estimator with PCA
from sklearn.pipeline import Pipeline, FeatureUnion
combined_features = FeatureUnion([("pca", pca), ("univ_select", selection)])
'''

# Task 4: Decide the classifier

# Final classifier: K-Nearest Neighbours Classifier
from sklearn.neighbors import KNeighborsClassifier
clf = KNeighborsClassifier(algorithm = 'ball_tree', leaf_size = 30, 
  n_neighbors = 1, metric = 'minkowski', metric_params = None, 
  p = 2, weights = 'uniform')

'''
# K-Nearest Neighbours Classifier
from sklearn.neighbors import KNeighborsClassifier
clf = KNeighborsClassifier(algorithm = 'ball_tree', leaf_size = 30, 
  n_neighbors = 1, metric = 'minkowski', metric_params = None, 
  p = 2, weights = 'uniform')

# GaussianNB Classifier
from sklearn.naive_bayes import GaussianNB
clf = GaussianNB()

# SVM Classifier
from sklearn.svm import SVC
clf = SVC(C = 10000, cache_size = 200, class_weight = None, coef0 = 0.0, 
  degree = 3, gamma = 0.1, kernel = 'rbf', max_iter = -1, probability = False,
  random_state = None, shrinking = True, tol = 0.001, verbose = False)

# Decission Tree Classifier
from sklearn.tree import DecisionTreeClassifier
clf = DecisionTreeClassifier(class_weight=None, criterion='gini', 
  max_depth=None, max_features=None, max_leaf_nodes=None, min_samples_leaf=1,
  min_samples_split=2, min_weight_fraction_leaf=0.0, random_state=42, 
  splitter='best')

# Adaboost Classifier
from sklearn.ensemble import AdaBoostClassifier
clf = AdaBoostClassifier(algorithm = 'SAMME.R', base_estimator = None,
  learning_rate = 1.0, n_estimators = 10, random_state = 42)

# Random Forest Classifier
from sklearn.ensemble import RandomForestClassifier
clf = RandomForestClassifier(bootstrap = True, class_weight = None, 
  criterion = 'gini', max_depth = None, max_features = 'auto', 
  max_leaf_nodes = None, min_samples_leaf = 1, min_samples_split = 5,
  min_weight_fraction_leaf = 0.0, n_estimators = 10, n_jobs = 1, 
  oob_score = False, random_state = 42, verbose = 0, warm_start = False)

# Task 5: Tune the classifier
parameters = {
  #'criterion': ['gini', 'entropy'],
  #'max_depth': [2,5,7,10,15],
  #'max_features': ['auto', 'sqrt', 'log2', None],
  #'min_samples_split': [2,5,7,10,15,30],
  #'n_neighbors':[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
  #'algorithm':['ball_tree','kd_tree','brute','auto'],
  #'weights': ['uniform', 'distance'],
  #'p': [1, 2],
  #'algorithm' : ['SAMME', 'SAMME.R'],
  #'n_estimators' : [10,100,1000],
  #'C': [1, 1e2, 1e3, 1e4, 1e5, 1e7, 1e9, 1e15],
  #'gamma': [0.0, 0.001, 0.01, 0.1],
  #'kernel': ['rbf', linear],
}

from sklearn.cross_validation import StratifiedShuffleSplit
crossValidation = StratifiedShuffleSplit(labels_train, 1000, random_state = 42)

from sklearn.grid_search import GridSearchCV
clf = GridSearchCV(clf, parameters, scoring = 'f1', cv = crossValidation, 
  verbose = 3, n_jobs = 20)
'''

from sklearn.pipeline import Pipeline
clf = Pipeline([
  #('anova', selection),
  #('pca', pca),
  #('features', combined_features),
  ('clf', clf)
  ])

'''
# Fit the model
clf.fit(features, labels)

# Get the best estimator when tuning the classifier
clf = clf.best_estimator_
'''

# Task 6: Dump your classifier, dataset, and features_list so anyone can
# check your results. 
dump_classifier_and_data(clf, my_dataset, features_list)