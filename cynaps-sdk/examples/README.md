# Cynaps SDK Use Case Examples

These end-to-end examples demonstrate how to use the SDK for specific use cases.

## Import

These scripts will help you import tasks with preannotations (predictions). 
* [import_preannotations.ipynb](import_preannotations/import_preannotations.ipynb) - The notebook with explanations: import tasks with preannotations for the classification labeling config
* [import_preannotations.py](import_preannotations/import_preannotations.py) - Import tasks with preannotations for the classification labeling config
* [import_brush_predictions.py](import_preannotations/import_brush_predictions.py) - This example shows how to import masks for BrushLabels

### Annotate data from Google Cloud Storage

If your data is hosted in Google Cloud Storage (GCS), you can write a Python script to continuously sync data from the bucket with Cynaps. Follow this example to see how to do that with the Cynaps SDK. It's convenient and secure to host data in the cloud for data labeling, then sync task references to Cynaps to allow annotators to view and label the tasks without your data leaving the secure cloud bucket, LS won't touch your bucket data directly, only user browsers will do it. 

[See the notebook: Annotate data from Google Cloud Storage](annotate_data_from_gcs/annotate_data_from_gcs.ipynb)


## Export

* [Export with filters](export_with_filters.py) - This example shows how to use the simplest version of exporting data with filters.
* [Export snapshots](export_snapshots.py) - This example shows how to export, check export status and download JSON shapshots from Cynaps.  This is detailed code on how to use snapshots. It includes the following steps:
  * Create a snapshot
  * Check the snapshot status
  * Download the snapshot
 * [Export YOLO with images](https://github.com/Cynaps/cynaps-sdk/blob/master/examples/export_yolo_with_images.py) - This script exports labeled data from a Cynaps project and converts it into the YOLO format, including downloading associated images.


## Machine Learning

#### [Active learning example](active_learning/active_learning.ipynb)

If you want to write a Python script to set up an active learning workflow for labeling and training, review this 
* [working active learning example as a Jupyter notebook](https://github.com/cynaps/cynaps-sdk/blob/master/examples/active_learning/active_learning.ipynb) or
* start with the [active learning python script example](https://github.com/cynaps/cynaps-sdk/blob/master/examples/active_learning/active_learning.py).

#### [Weak supervision example](examples/weak_supervision/weak_supervision.ipynb)

If you want to write a Python script to perform programmatic labeling and use weak supervision to correct the noisy labels, refer to this [working weak supervision example as a Jupyter notebook](examples/weak_supervision/weak_supervision.ipynb) or start with the [weak supervision python script example](examples/weak_supervision/weak_supervision.py).


## [Cynaps Enterprise](cynaps_enterprise)

Scripts for the enterprise version of Cynaps. 

* [cynaps_enterprise/assigner.py](cynaps_enterprise/assigner.py) - This script runs every 10 seconds and assigns users to a new batch of tasks filtered by the specified column.
* [cynaps_enterprise/assignment.ipynb](cynaps_enterprise/assignment.ipynb) - This tutorial describes the basics of assigning users to projects, workspaces, and specific tasks in Cynaps Enterprise using the Python SDK.
* [cynaps_enterprise/user_management.ipynb](cynaps_enterprise/user_management.ipynb) - This tutorial describes the basics of managing users in Cynaps Enterprise using the Python SDK.

## [Migrate LS to Cynaps](migrate_ls_to_ls)

This script does the migration from one Cynaps instance to another (enterprise versions are supported too) using API. 

## Others
* [Adding new labels to the project](adding_new_labels_to_project.ipynb) - This tutorial demonstrates how to add new labels to an ongoing project in real-time. The included example showcases the use of the <Taxonomy> tag, which can be applied to the entire document. However, this same principle can also be used for other cases, such as modifying labels for computer vision applications (bounding boxes, polygons, etc.), or segments in text and audio using nested <Taxonomy> tags.
* [Data Manager tab management](view_management.ipynb) - This tutorial describes the basics of managing views (tabs) in Cynaps Data Manager using the Python SDK.

<img src="https://cynaps.io/images/opossum/other/5.svg" width="400px">


