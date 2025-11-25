# Geoanalysis

This repository contains Jupyter notebooks and scripts for geospatial analysis using Google Earth Engine (GEE). The work focuses on NDVI-based anomaly detection (RVF) and precipitation time-series aggregation and visualization.

## Contents
- gis_analysis_practice.ipynb — NDVI / MODIS-based processing and RVF (three-month anomaly detection), visualization with folium / geemap, and exporting to Drive/Asset.
- stat_altair_Precipitation_per8_buffering20km.ipynb — CHIRPS precipitation processing: 8-day aggregation, regional statistics (20 km buffer around a point), Altair visualizations, and CSV export.

## Requirements
- Python 3.8
- earthengine-api
- geemap
- folium
- pandas, numpy
- altair
- (Optional) Google Colab or Jupyter Notebook

Install typical dependencies:
```
pip install earthengine-api geemap folium pandas numpy altair
```

## Setup
1. Authenticate and initialize Earth Engine before running notebooks:
   - In local Jupyter: run `ee.Authenticate()` then `ee.Initialize()`.
   - In Colab: follow geemap / earthengine setup cells to authenticate.

2. Open the desired notebook and run cells sequentially. Some cells export results to:
   - Google Drive (to_csv or image export)
   - Earth Engine Assets
