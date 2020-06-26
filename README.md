# PAD-UFES-20 repository

This repository gives access to the software developed to collect and analyse the
data present in the `PAD-UFES-20` dataset, which is available for download at [zenodo.org](https://zenodo.org/record/3903894#.XvZu8HVKiUk)
<hr>

## Analysis   
[A Jupyter notebook](analysis/pad-ufes-20-analysis.ipynb) was coded to analyse the `PAD-UFES-20` dataset.
This exploratory analysis takes into account the number of samples per diagnostic, the patients age distribution,
the frequency of each anatomical region per diagnostic and the patients family background.

<hr>

## Figures
This folder contains all plots obtained from the [data analysis](analysis/pad-ufes-20-analysis.ipynb)
and a schematic of the [software](software) architecture used to collect the data.

<hr>

## Sanity Check
Makes available a [script](sanity_check/sanity_check.py) coded to check the sanity of the data.
It checks if there are any missing data, and if there is a corresponding image for each image
path in the dataset. Besides, it checks for abnormalities, i.g., patients older than 100 years old,
or lesions region that do not correspond to any of the 15 macro-regions described in [ref paper](link paper)   

## Software
In this folder is available all the code used to build the platform to collect the data.
It is divided into two main parts, described as follows:

* [Fronted](software/frontend): Implements all the user view, making it possible to send requests to the server.
* [Server](software/server): Manages the database, allowing access to the data when requested by the frontend through http requests. 