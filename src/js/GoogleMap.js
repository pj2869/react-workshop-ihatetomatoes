import React from 'react';
import PropTypes from 'prop-types';

class GoogleMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        };
    }

    componentDidMount() {
        const { properties, activeProperty } = this.props;
        const { latitude, longitude } = activeProperty;

        this.map = new google.maps.Map(this.refs.map, {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
            mapTypeControl: false,
        });

        this.createMarkers(properties);
    }

    showInfoWindow(index) {
        const { markers } = this.state;
        markers[index] && markers[index].iw.open(this.map, markers[index]);
    }

    componentWillReceiveProps(nextProps) {
        const { activeProperty, filteredProperties, isFiltering } = nextProps;
        const { index } = activeProperty;

        // Hide all the other info boxes
        this.hideAll();

        // SHow info window of new active property
        if (isFiltering && filteredProperties.length === 0) {
            this.hideAll();
        } else {
            this.hideAll();
            this.showInfoWindow(index);
        }
    }

    componentDidUpdate() {
        const { filteredProperties, isFiltering } = this.props;
        const { markers } = this.state;

        markers.forEach((marker) => {
            const { property } = marker; // Return associated property

            if (isFiltering) {
                // show markers of filtered properties and hide other markers
                if (filteredProperties.includes(property)) {
                    markers[property.index].setVisible(true);
                } else {
                    // Hide all the other markers
                    markers[property.index].setVisible(false);
                }
            } else {
                // show all markers
                markers[property.index].setVisible(true);
            }
        });
    }

    createMarkers(properties) {
        const { setActiveProperty, activeProperty } = this.props;
        const activePropertyIndex = activeProperty.index;
        const { markers } = this.state;

        properties.map((property) => {
            const { latitude, longitude, index, address } = property;
            const iw = new google.maps.InfoWindow({
                content: `<h1>${address}</h1>`,
            });

            this.marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: this.map,
                label: {
                    color: '#fff',
                    text: `${index + 1}`,
                },
                icon: {
                    url: 'https://ihatetomatoes.net/react-tutorials/google-maps/images/img_map-marker.png',
                    size: new google.maps.Size(22, 55),
                    // The origin for this image is (0, 0).
                    origin: new google.maps.Point(0, -15),
                    // The anchor for this image is the base of the cross at (11, 52).
                    anchor: new google.maps.Point(11, 52),
                },
                property,
            });

            this.marker.iw = iw;

            this.marker.addListener('click', () => {
                // Hide all markers
                this.hideAll();
                // Set active property, scroll to active property in list
                setActiveProperty(property, true);
            });

            // Push marker on to state
            markers.push(this.marker);

            this.showInfoWindow(activePropertyIndex);
        });
    }

    hideAll() {
        const { markers } = this.state;

        markers.forEach((marker) => {
            marker.iw.close();
        });
    }

    render() {
        return (
            <div className="mapContainer">
                <div id="map" ref="map"></div>
            </div>
        );
    }
}

GoogleMap.propTypes = {
    properties: PropTypes.array.isRequired,
    setActiveProperty: PropTypes.func.isRequired,
    activeProperty: PropTypes.object.isRequired,
    filteredProperties: PropTypes.array,
    isFiltering: PropTypes.bool.isRequired,

};

export default GoogleMap;
