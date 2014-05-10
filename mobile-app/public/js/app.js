$(document).ready(function () {
  var map, cursor, latestLight;
  var lights = [];

  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(29.953611866615528, -90.0817357447147),
      zoom: 18,
      panControl: true,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    geolocate();

    var lightControlDiv = document.createElement('div');
    var lightControl = new LightControl(lightControlDiv, map);

    lightControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(lightControlDiv);

    // Go get the lights
    fetchLights();
  }

  google.maps.event.addDomListener(window, 'load', initialize);

  function icon(color, size) {
    size = size || 25;
    return {
      url: 'http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png',
      size: new google.maps.Size(size, size),
      origin: null,
      anchor: null,
      scaledSize: new google.maps.Size(size, size)
    };
  }

  function renderLights(lights) {
    lights.forEach(function(light) {

      var color = {
        working: 'green',
        broken: 'yellow',
        unusable: 'red'
      }[light.status];

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(light.location[1], light.location[0]),
        map: map,
        icon: icon(color),
      });
    });
  }

  function createLight() {
    $.magnificPopup.open({
      items: {
        src: '<div class="white-popup"><button class="works-button" data-value="working">Working</button><button class="works-button" data-value="broken">Broken</button><button class="works-button" data-value="unusable">Unusable</button></div>',
        type: 'inline'
      }
    });

    $('button.works-button').click(function() {
      var value = $(this).attr('data-value');
      $.magnificPopup.close();
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/lights',
        data: {
          location: [cursor.getPosition().lng(), cursor.getPosition().lat()],
          status: value,
        },
        success: fetchLights
      });
    });
  }

  function fetchLights() {
    $.ajax({
      dataType: 'json',
      url: '/lights',
      data: {
        criteria: {
          createdAt: { $gt: latestLight },
        },
        perPage: 1000,
        page: 1
      },
      success: function(resp) {
        latestLight = resp.lights[0].createdAt;
        // resp.lights.forEach(function(light) {
        //   lights.push(light);
        // });
        renderLights(resp.lights);
      }
    });
  }

  function geolocate() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        cursor = new google.maps.Marker({
          map: map,
          position: pos,
          draggable: true,
          icon: icon('blue', 100)
        });

        map.setCenter(pos);
      }, function() {
        alert('no geolocation');
      }, {
        enableHighAccuracy: true
      });
    }
  }

  /** Custom add light control button **/
  function LightControl(controlDiv, map) {
    controlDiv.style.padding = '30px';

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to create a new light at the cursor position';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '14px';
    controlText.style.paddingLeft = '8px';
    controlText.style.paddingRight = '8px';
    controlText.innerHTML = '<b>Add Light</b>';
    controlUI.appendChild(controlText);

    google.maps.event.addDomListener(controlUI, 'click', function() {
      createLight();
    });
  }

});
