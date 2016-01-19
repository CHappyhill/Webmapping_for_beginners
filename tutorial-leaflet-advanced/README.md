# Leaflet and PDOK

## Leaflet Advanced Tutorial

### Introduction

[Publieke Dienstverlening Op de Kaart](http://www.pdok.nl) (PDOK) (or _Public Service on the Map_) is a Dutch government initiative to provide a wide range of geographic web services. Many of these services provide data sets that are available under an **open** license. Typically, you would use a desktop GIS application or the [OpenLayers](http://www.openlayers.org) JavaScript library to use these services. This is the where the [Open Geospatial Consortium](http://www.opengeospatial.org) (OGC) standards for geographic web services were first implemented. Nevertheless, there are a number of ways you can just as well use Leaflet to consume these geographic web services for your online mapping application and leverage the potential of the wealth of data available from PDOK.

There is one caveat: maps from Google, Bing, OpenStreetMap come in the [Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator) projection, whereas for the Netherlands the projection used is Rijksdriehoekstelsel (RD) or Amersfoort New. Each spatial reference system is identified by a code. The code for Web Mercator is [EPSG:3857](http://epsg.io/3857). The code for Amersfoort New is [EPSG:28992](http://epsg.io/28992). A third spatial reference system to keep in mind is WGS-84, the coordinates used by GPS systems that are recorded in longitude and latitude, identified by the code [EPSG:4326](http://epsg.io/4326).

For this tutorial, we will be using [Leaflet.js 1.0.0 beta 2](http://mourner.github.io/Leaflet/reference.html):

````javascript
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.css" />
<script src="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.js"></script>
````

### Simply add a map image from PDOK

The Open Geospatial Consortium (OGC) has created the [Web Mapping Service](https://en.wikipedia.org/wiki/Web_Map_Service) (WMS) recommendation to standardise the retrieval of geographically referenced images. Most data sets from PDOK are available as a WMS service. To get a sense of the range of services, you can browse the [Nationaal Georegister](http://www.nationaalgeoregister.nl/). For this tutorial we'll add a map of the number of cars per household for each neighbourhood.

````javascript
var cbs_cars = L.tileLayer.wms('http://geodata.nationaalgeoregister.nl/wijkenbuurten2014/wms', {
    layers: 'cbs_buurten_2014',
    styles: 'wijkenbuurten_thema_buurten_gemeentewijkbuurt_gemiddeld_aantal_autos_per_huishouden',
    format: 'image/png',
    attribution: '<a href="http://www.cbs.nl/">Centraal Bureau voor de Statistiek</a>',
}).addTo(map);
````

* The service endpoint for neighbourhood statistics from 2014 is `http://geodata.nationaalgeoregister.nl/wijkenbuurten2014/wms`.
* The visualisation of cars per household is defined in the style `wijkenbuurten_thema_buurten_gemeentewijkbuurt_gemiddeld_aantal_autos_per_huishouden`.
* Leaflet requests the images with MIME-type `image/png`.
* The data is attributed to `Statistics Netherlands`.

Leaflet calculates the coordinates of the bounding box at each zoom level to supply with the request. Also, Leaflet sets the default width and height to be 256 pixels. Finally, Leaflet uses the default Web Mercator projection in its requests. See how all tiles appear as you load the map in your Web browser. For the full WMS requests, use your favorite debugging tools.

[Full demo](1/).

Try and add images for the height data to your map. You can search the Nationaal Georegister website for the `AHN` to find the proper service endpoint.
