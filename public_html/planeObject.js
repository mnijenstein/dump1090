const nauticalMilesToMeters = 1852;
const degreesToMeters = 60 * nauticalMilesToMeters;
const radiansToDegrees = 180 / math.pi;

const home = [51.956626, 5.875802, 0];

var planeObject = {
	oldlat		: null,
	oldlon		: null,
	oldalt		: null,

	// Basic location information
	altitude	: null,
	speed		: null,
	track		: null,
	latitude	: null,
	longitude	: null,
    position    : null,
    height      : null,
	
	// Info about the plane
	flight		: null,
	squawk		: null,
	icao		: null,

	// Data packet numbers
	messages	: null,
	seen		: null,

	// Vaild...
	vPosition	: false,
	vTrack		: false,

	// When was this last updated?
	updated		: null,
	reapable	: false,

	// Update our data
	funcUpdateData	: function(data){
			// So we can find out if we moved
			var oldlat 	= this.latitude;
			var oldlon	= this.longitude;
			var oldalt	= this.altitude;

			// Update all of our data
			this.updated	= new Date().getTime();
			this.altitude	= data.altitude;
            this.height     = this.altitude/3.2828;
			this.speed	= data.speed;
			this.track	= data.track;
			this.latitude	= data.lat;
			this.longitude	= data.lon;
			this.flight	= data.flight;
			this.squawk	= data.squawk;
			this.icao	= data.hex;
			this.messages	= data.messages;
			this.seen	= data.seen;
            this.position = [this.latitude, this.longitude, this.height];

			// If no packet in over 58 seconds, consider the plane reapable
			// This way we can hold it, but not show it just in case the plane comes back
			if (this.seen > 58) {
				this.reapable = true;
			} else {
				this.reapable = false;
			}

			// Is the position valid?
			if ((data.validposition == 1) && (this.reapable == false)) {
				this.vPosition = true;

				// Detech if the plane has moved
				changeLat = false;
				changeLon = false;
				changeAlt = false;
				if (oldlat != this.latitude) {
					changeLat = true;
				}
				if (oldlon != this.longitude) {
					changeLon = true;
				}
				if (oldalt != this.altitude) {
					changeAlt = true;
				}
				PlanesOnMap++;
			} else {
				this.vPosition = false;
			}

			// Do we have a valid track for the plane?
			if (data.validtrack == 1)
				this.vTrack = true;
			else
				this.vTrack = false;

	},

    getFlight : function() {
        return this.flight;
    },

    getHeight : function() {
        return this.height;
    },

    getRelativePosition : function(reference) {
        return math.subtract(this.position, reference);
    },

    getRelativeDirection : function(reference) {
        var diff = this.getRelativePosition(reference);
        var angle = math.atan2(diff[0] , diff[1]);
        if (angle < 0) angle += 2 * math.pi;
        return angle;
    },

    getRelativeDirectionInDegrees : function(reference) {
        return radiansToDegrees * this.getRelativeDirection(reference);
    },

    getRelativeHorizontalDistance : function(reference) {
        var thisLatRad = this.position[0] / radiansToDegrees;
        var refLatRad = reference[0] / radiansToDegrees;
        var theta = (this.position[1] - reference[1]) / radiansToDegrees;

        var distance = math.sin(thisLatRad) * math.sin(refLatRad) + math.cos(thisLatRad) * math.cos(refLatRad) * math.cos(theta);
        if (distance > 1) distance = 1;
        distance = math.acos(distance); // radians
        distance = (distance * radiansToDegrees) * degreesToMeters; // meters
        return distance;
    },

    getRelativeHeight : function(reference) {
        return this.position[2] - reference[2];
    },

    getRelativeElevation : function(reference) {
        return math.atan(this.getRelativeHeight(reference) / this.getRelativeHorizontalDistance(reference));
    },
   
    getRelativeElevationInDegrees : function(reference) {
        return radiansToDegrees * this.getRelativeElevation(reference);
    }
};
