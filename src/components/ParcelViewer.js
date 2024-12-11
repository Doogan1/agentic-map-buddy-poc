import React, { useState, useEffect, useRef } from 'react';

const ParcelViewer = () => {
  const BASE_URL = 'https://gis.vanburencountymi.gov/van-buren-county-mi/maps/139519/parcel-viewer';
  const LAYER_ID = 'b386acf6-77e2-11ee-be3d-027d7e0bb32b';
  
  const [mapUrl, setMapUrl] = useState(`${BASE_URL}?preview=true`);
  const iframeRef = useRef(null);
  
  useEffect(() => {
    const handleMapUpdate = async (event) => {
      try {
        const response = await fetch('http://localhost:3001/api/update-map', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event.detail),
        });
        
        const data = await response.json();
        
        if (data.success) {
          updateMapFeature(data.data.fieldName, data.data.fieldValue);
        }
      } catch (error) {
        console.error('Error updating map:', error);
      }
    };

    window.addEventListener('updateMap', handleMapUpdate);
    return () => window.removeEventListener('updateMap', handleMapUpdate);
  }, []);

  const updateMapFeature = (fieldName, fieldValue) => {
    console.log('Updating map with:', { fieldName, fieldValue });
    const newUrl = `${BASE_URL}?field=${fieldName}&value=${fieldValue}&layer=${LAYER_ID}&preview=true`;
    console.log('New URL:', newUrl);
    
    // Update the iframe src
    setMapUrl(newUrl);
  };

  return (
    <div className="w-full h-screen max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <button 
          onClick={() => {
            const event = new CustomEvent('updateMap', {
              detail: { fieldName: 'parcel_no', fieldValue: '80-14-021-006-00' }
            });
            window.dispatchEvent(event);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test MapBuddy Update
        </button>
      </div>
      
      <iframe
        ref={iframeRef}
        src={mapUrl}
        className="w-full h-full border-2 border-gray-300 rounded"
        title="Van Buren County Parcel Viewer"
      />
    </div>
  );
};

export default ParcelViewer;