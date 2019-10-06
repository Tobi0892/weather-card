const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;

const weatherIconsDay = {
  "clear-day": "day",
  "clear-night": "night",
  rain: "rainy-5",
  snow: "snowy-6",
  sleet: "rainy-7",
  wind: "cloudy",
  fog: "cloudy",
  cloudy: "cloudy",
  "partly-cloudy-day": "cloudy-day-3",
  "partly-cloudy-night": "cloudy-night-3",
  hail: "rainy-7",
  thunderstorm: "thunder",
  tornado: "thunder",
  exceptional: "!!"
};

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("_config")) {
    return true;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    return (
      oldHass.states[element._config.entity] !==
        element.hass.states[element._config.entity] ||
      oldHass.states["sun.sun"] !== element.hass.states["sun.sun"]
    );
  }

  return true;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addHours = function(hours) {
    var date = new Date(this.valueOf());
    date.setHours(date.getHours() + hours);
    return date;
}

class WeatherCard extends LitElement {
  static get properties() {
    return {
      _config: {},
      hass: {}
    };
  }

  static async getConfigElement() {
    await import("./weather-card-editor.js");
    return document.createElement("weather-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    if (!config.entity_temperature) {
      throw new Error("Please define a weather entity");
    }
    this._config = config;
  }

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const lang = this.hass.selectedLanguage || this.hass.language;
    const date = new Date();

    const stateObj = {
      icon: this.hass.states[this._config.entity_icon],
      temperature: this.hass.states[this._config.entity_temperature],
      apparent_temperature: this.hass.states[this._config.entity_apparent_temperature],
      high_temperature: this.hass.states[this._config.entity_high_temperature + '_0d'],
      low_temperature: this.hass.states[this._config.entity_low_temperature + '_0d'],
      humidity: this.hass.states[this._config.entity_humidity],
      wind_speed: this.hass.states[this._config.entity_wind_speed],
      cloud_cover: this.hass.states[this._config.entity_cloud_cover],
      precip_probability: this.hass.states[this._config.entity_precip_probability],
      forecast: [
        {
          day: date.addDays(1).toLocaleDateString(lang,{weekday: "short"}),
          high_temperature: this.hass.states[this._config.entity_high_temperature + '_1d'],
          low_temperature: this.hass.states[this._config.entity_low_temperature + '_1d'],
          icon: this.hass.states[this._config.entity_icon + '_1d']
        },
        {
          day: date.addDays(2).toLocaleDateString(lang,{weekday: "short"}),
          high_temperature: this.hass.states[this._config.entity_high_temperature + '_2d'],
          low_temperature: this.hass.states[this._config.entity_low_temperature + '_2d'],
          icon: this.hass.states[this._config.entity_icon + '_2d']
        },
        {
          day: date.addDays(3).toLocaleDateString(lang,{weekday: "short"}),
          high_temperature: this.hass.states[this._config.entity_high_temperature + '_3d'],
          low_temperature: this.hass.states[this._config.entity_low_temperature + '_3d'],
          icon: this.hass.states[this._config.entity_icon + '_3d']
        },
        {
          day: date.addDays(4).toLocaleDateString(lang,{weekday: "short"}),
          high_temperature: this.hass.states[this._config.entity_high_temperature + '_4d'],
          low_temperature: this.hass.states[this._config.entity_low_temperature + '_4d'],
          icon: this.hass.states[this._config.entity_icon + '_4d']
        },
        {
          day: date.addDays(5).toLocaleDateString(lang,{weekday: "short"}),
          high_temperature: this.hass.states[this._config.entity_high_temperature + '_5d'],
          low_temperature: this.hass.states[this._config.entity_low_temperature + '_5d'],
          icon: this.hass.states[this._config.entity_icon + '_5d']
        }
      ],
      today: [
        {
          time: date.addHours(2).toLocaleDateString(lang, {hour: "2-digit", minute: "2-digit"}).split(", ")[1],
          temperature: this.hass.states[this._config.entity_temperature + '_2h'],
          icon: this.hass.states[this._config.entity_icon + '_2h']
        },
        {
          time: date.addHours(4).toLocaleDateString(lang, {hour: "2-digit", minute: "2-digit"}).split(", ")[1],
          temperature: this.hass.states[this._config.entity_temperature + '_4h'],
          icon: this.hass.states[this._config.entity_icon + '_4h']
        },
        {
          time: date.addHours(6).toLocaleDateString(lang, {hour: "2-digit", minute: "2-digit"}).split(", ")[1],
          temperature: this.hass.states[this._config.entity_temperature + '_6h'],
          icon: this.hass.states[this._config.entity_icon + '_6h']
        },
        {
          time: date.addHours(8).toLocaleDateString(lang, {hour: "2-digit", minute: "2-digit"}).split(", ")[1],
          temperature: this.hass.states[this._config.entity_temperature + '_8h'],
          icon: this.hass.states[this._config.entity_icon + '_8h']
        },
        {
          time: date.addHours(10).toLocaleDateString(lang, {hour: "2-digit", minute: "2-digit"}).split(", ")[1],
          temperature: this.hass.states[this._config.entity_temperature + '_10h'],
          icon: this.hass.states[this._config.entity_icon + '_10h']
        }
      ]
    };
    
    if (!stateObj) {
      return html`
        <style>
          .not-found {
            flex: 1;
            background-color: yellow;
            padding: 8px;
          }
        </style>
        <ha-card>
          <div class="not-found">
            Entity not available: ${this._config.entity_temperature}
          </div>
        </ha-card>
      `;
    }

    const next_rising = new Date(
      this.hass.states["sun.sun"].attributes.next_rising
    );
    const next_setting = new Date(
      this.hass.states["sun.sun"].attributes.next_setting
    );

    return html`
      ${this.renderStyle()}
      <ha-card @click="${this._handleClick}">
        <span
          class="icon bigger"
          style="background: none, url(${this.getWeatherIcon(stateObj.icon.state)}) no-repeat; background-size: contain;"
          >${stateObj.state}
        </span>
        ${
          this._config.name
            ? html`
                <span class="title"> ${this._config.name} </span>
              `
            : ""
        }
        <br />
        <span class="temp">
          ${stateObj.temperature.state}
        </span>        
        <span class="tempc">
          ${stateObj.temperature.attributes.unit_of_measurement}
        </span>  
        <span class="tempap">
          gefühlt ${stateObj.apparent_temperature.state} ${stateObj.apparent_temperature.attributes.unit_of_measurement}
        </span>      
        <span>
          <ul class="variations">
            <li>
              <span class="ha-icon">
                <ha-icon icon="mdi:thermometer-high"></ha-icon>
              </span>
              ${stateObj.high_temperature.state}
              <span class="unit">
                ${stateObj.high_temperature.attributes.unit_of_measurement}
              </span>
              <br />
              <span class="ha-icon">
                <ha-icon icon="mdi:water-percent"></ha-icon>
              </span>
              ${stateObj.humidity.state}
              <span class="unit">
                ${stateObj.humidity.attributes.unit_of_measurement}
              </span>
              <br />
              <span class="ha-icon">
                <ha-icon icon="mdi:weather-windy"></ha-icon>
              </span>
              ${stateObj.wind_speed.state}
              <span class="unit">
                ${stateObj.wind_speed.attributes.unit_of_measurement}
              </span>
              <br />
              <span class="ha-icon">
                <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
              </span>
              ${next_rising.toLocaleTimeString()}
            </li>
            <li>
              <span class="ha-icon">
                <ha-icon icon="mdi:thermometer-low"></ha-icon>
              </span>
              ${stateObj.low_temperature.state}
              <span class="unit">
                ${stateObj.low_temperature.attributes.unit_of_measurement}
              </span>
              <br />
              <span class="ha-icon">
                <ha-icon icon="mdi:weather-pouring"></ha-icon>
              </span>
              ${stateObj.precip_probability.state}
              <span class="unit">
                ${stateObj.precip_probability.attributes.unit_of_measurement}
              </span>
              <br />
              <span class="ha-icon">
                <ha-icon icon="mdi:weather-cloudy"></ha-icon>
              </span>
              ${stateObj.cloud_cover.state}
              <span class="unit">
                ${stateObj.cloud_cover.attributes.unit_of_measurement}
              </span>
              <br />
              <span class="ha-icon">
                <ha-icon icon="mdi:weather-sunset-down"></ha-icon>
              </span>
              ${next_setting.toLocaleTimeString()}
            </li>
          </ul>
        </span>
        ${
          stateObj.today &&
          stateObj.today.length > 0
            ? html`
                <div class="forecast clear">
                  ${
                    stateObj.today.slice(0, 5).map(
                      hourly => html`
                        <div class="day">
                          <span class="dayname">${hourly.time}</span>
                          <br />
                          <i class="icon" style="background: none, url(${this.getWeatherIcon(hourly.icon.state)}) no-repeat; background-size: contain;"></i>
                          <br />
                          <span class="highTemp">
                            ${hourly.temperature.state} ${hourly.temperature.attributes.unit_of_measurement}
                          </span>
                        </div>
                      `
                    )
                  }
                </div>
              `
            : ""
        }
        ${
          stateObj.forecast &&
          stateObj.forecast.length > 0
            ? html`
                <div class="forecast clear">
                  ${
                    stateObj.forecast.slice(0, 5).map(
                      daily => html`
                        <div class="day">
                          <span class="dayname">${daily.day}</span>
                          <br />
                          <i class="icon" style="background: none, url(${this.getWeatherIcon(daily.icon.state)}) no-repeat; background-size: contain;"></i>
                          <br />
                          <span class="highTemp">
                            ${daily.high_temperature.state} ${daily.high_temperature.attributes.unit_of_measurement}
                          </span>
                          ${
                            typeof daily.low_temperature !== 'undefined'
                              ? html`
                                  <br />
                                  <span class="lowTemp">
                                    ${daily.low_temperature.state} ${daily.low_temperature.attributes.unit_of_measurement}
                                  </span>
                                `
                              : ""
                          }
                        </div>                     `
                    )
                  }
                </div>
              `
            : ""
        }
      <br />  
      </ha-card>
    `;
  }

  getWeatherIcon(condition) {
    return `${
      this._config.icons
        ? this._config.icons
        : "https://cdn.jsdelivr.net/gh/bramkragten/custom-ui@master/weather-card/icons/animated/"
    }${weatherIconsDay[condition]}.svg`;
  }

  _handleClick() {
    fireEvent(this, "hass-more-info", { entityId: this._config.entity });
  }

  getCardSize() {
    return 3;
  }

  renderStyle() {
    return html`
      <style>
        ha-card {
          margin: auto;
          padding-top: 2.5em;
          padding-bottom: 1.3em;
          padding-left: 1em;
          padding-right: 1em;
          position: relative;
        }

        .clear {
          clear: both;
        }

        .ha-icon {
          height: 18px;
          margin-right: 5px;
          color: var(--paper-item-icon-color);
        }

        .title {
          position: absolute;
          left: 3em;
          top: 0.6em;
          font-weight: 300;
          font-size: 3em;
          color: var(--primary-text-color);
        }
        
        .temp {
          font-weight: 300;
          font-size: 4em;
          color: var(--primary-text-color);
          position: absolute;
          right: 1em;
          top: 0.3em;
        }
        
        .tempap {
          font-weight: 300;
          font-size: 1em;
          color: var(--secondary-text-color);
          position: absolute;
          right: 2.1em;
          top: 5.5em;
        }

        .tempc {
          font-weight: 300;
          font-size: 1.5em;
          vertical-align: super;
          color: var(--primary-text-color);
          position: absolute;
          right: 1em;
          top: 1.2em;
          margin-right: 7px;
        }

        .variations {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-between;
          font-weight: 300;
          color: var(--primary-text-color);
          list-style: none;
          margin-top: 4.5em;
          padding: 0;
        }

        .variations li {
          flex-basis: auto;
        }

        .variations li:first-child {
          padding-left: 1em;
        }

        .variations li:last-child {
          padding-right: 1em;
        }

        .unit {
          font-size: 0.8em;
        }

        .forecast {
          width: 100%;
          margin: 0 auto;
          height: 9em;
        }

        .day {
          display: block;
          width: 20%;
          float: left;
          text-align: center;
          color: var(--primary-text-color);
          border-right: 0.1em solid var(--paper-input-container-color, var(--secondary-text-color));
          line-height: 2;
          box-sizing: border-box;
        }

        .dayname {
          text-transform: uppercase;
        }

        .forecast .day:first-child {
          margin-left: 0;
        }

        .forecast .day:nth-last-child(1) {
          border-right: none;
          margin-right: 0;
        }

        .highTemp {
          font-weight: bold;
        }

        .lowTemp {
          color: var(--secondary-text-color);
        }

        .icon.bigger {
          width: 10em;
          height: 10em;
          margin-top: -4em;
          position: absolute;
          left: 0em;
        }

        .icon {
          width: 50px;
          height: 50px;
          margin-right: 5px;
          display: inline-block;
          vertical-align: middle;
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
          text-indent: -9999px;
        }

        .weather {
          font-weight: 300;
          font-size: 1.5em;
          color: var(--primary-text-color);
          text-align: left;
          position: absolute;
          top: -0.5em;
          left: 6em;
          word-wrap: break-word;
          width: 30%;
        }
      </style>
    `;
  }
}
customElements.define("weather-card", WeatherCard);