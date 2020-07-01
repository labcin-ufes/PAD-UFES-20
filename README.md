# PAD-UFES-20 repository

This repository contains the code related to the `PAD-UFES-20` dataset, which is available for download on [zenodo.org](https://zenodo.org/record/3903894#.XvZu8HVKiUk)
<hr>

## Sanity Check
This [script](sanity_check/sanity_check.py) performs a sanity check to make sure the `metadata.csv` is ok. Essentialy, we check the `img_id` and the correspondent images, anomaly on data, etc. If everything is ok, the script outputs a message on the screen saying it's ok.
<hr>

## Data Exploratoring Analysis (DEA)
In this [Jupyter notebook](analysis/pad-ufes-20-analysis.ipynb) we present a brief DEA to assess the metadata presented in `PAD-UFES-20`. We analyze the samples frequency for each skin lesion, patient's age distribution, anatomical region, etc.
![age_dist](https://github.com/labcin-ufes/PAD-UFES-20/blob/master/figures/age_distribution.png)

<hr>

## Software
The [software folder](https://github.com/labcin-ufes/PAD-UFES-20/tree/master/software) contains the code we developed to build the webservers to collect data. Each part of this folder has an individual `README.d`. It basicaly contains two parts:
* [Fronted](software/frontend)
* [Server](software/server)

This figure summarizes how the webserver works:
![webserver](https://github.com/labcin-ufes/PAD-UFES-20/blob/master/figures/webserver.png)


<hr>
If you have any suggestions or find any bug, please, don't hesitate to contact us.
