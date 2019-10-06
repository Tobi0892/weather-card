**Adjusted to support weather data from darksky and display both a hourly and daily forecast.**

![Weather Card](https://github.com/Tobi0892/weather-card/blob/master/weather-card.png?raw=true)

Originally created for the [old UI](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008) converted by @arsaboo and @ciotlosm to [Lovelace](https://community.home-assistant.io/t/custom-ui-weather-state-card-with-a-question/23008/291) and converted to Lit to make it even better.

This card uses the awesome [animated SVG weather icons by amCharts](https://www.amcharts.com/free-animated-svg-weather-icons/).

## Installation

Copy the weather-card.js file to the config/www folder and add the following to resources in your lovelace config:

```yaml
resources:
  - url: /local/custom-lovelace/weather-card/weather-card.js
    type: module
    
```

## Configuration:

And add a card with type `custom:weather-card`:

```yaml
type: custom:weather-card
entity_icon: sensor.dark_sky_icon
entity_temperature: sensor.dark_sky_temperature
entity_apparent_temperature: sensor.dark_sky_apparent_temperature
entity_high_temperature: sensor.dark_sky_daytime_high_temperature
entity_low_temperature: sensor.dark_sky_overnight_low_temperature
entity_humidity: sensor.dark_sky_humidity
entity_wind_speed: sensor.dark_sky_wind_speed
entity_cloud_cover: sensor.dark_sky_cloud_coverage
entity_precip_probability: sensor.dark_sky_precip_probability
```

If you want to use your local icons add the location to the icons:

```yaml
type: custom:weather-card
entity: weather.yourweatherentity
icons: "/local/custom-lovelace/weather-card/icons/"
```

```yaml
# Example sensor.yaml entry
- platform: darksky
  api_key: !secret darksky
  language: de
  units: ca
  scan_interval:
    minutes: 5
  hourly_forecast:
  - 2
  - 4
  - 6
  - 8
  - 10
  forecast:
  - 0
  - 1
  - 2
  - 3
  - 4
  - 5
  monitored_conditions:
  - temperature_high # daytime high temperature
  - temperature_low # overnight low temperature
  - icon
  - precip_probability # rain
  - temperature # air temperature
  - apparent_temperature # “feels like” temperature
  - wind_speed # wind
  - cloud_cover # percentage of sky occluded by clouds
  - humidity # relative humidity
```
