import type Place from '@/types/place';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { apiClient } from '@/services/apiClient';

// Functions requiring PlacesService will need access to Google Map object
// onMounted -> mapRef.value.$mapPromise (returns a promise so can use .then())

export const updatePlaceID = (
    service: google.maps.places.PlacesService,
    place: Place,
    route: RouteLocationNormalizedLoaded
) => {
    const query: google.maps.places.FindPlaceFromQueryRequest = {
        query: `${place.name}`,
        fields: ['place_id'],
    };

    const callback = async (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
    ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (results) {
                await apiClient.patch(`/places/${route.params.id}`, {
                    placeId: results[0].place_id as string,
                });
            } else {
                console.error('An error occurred:', status);
            }
        }
    };

    // Get place_id
    service.findPlaceFromQuery(query, callback);
};

// Valid query fields can be found in the Place Details docs:
// https://developers.google.com/maps/documentation/javascript/places#place_details

export const fetchPlaceData = (
    service: google.maps.places.PlacesService,
    placeId: Place['placeId'],
    queryFields: string[]
) => {
    let placeResult: google.maps.places.PlaceResult | null;

    const query: {
        placeId: string;
        fields: string[];
    } = {
        placeId: placeId,
        fields: queryFields,
    };

    return new Promise((resolve, reject) => {
        service.getDetails(
            query,
            (
                place: google.maps.places.PlaceResult | null,
                status: google.maps.places.PlacesServiceStatus
            ) => {
                if (
                    status == window.google.maps.places.PlacesServiceStatus.OK
                ) {
                    placeResult = place;
                } else {
                    console.error('An error occurred:', status);
                }

                resolve(placeResult);
                reject('An error occurred');
            }
        );
    });
};
