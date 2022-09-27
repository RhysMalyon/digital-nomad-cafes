import type Image from '@/types/image';

export default interface Place {
    id: number;
    placeId: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    location?: {
        lat: number;
        lng: number;
    };
    hasWifi: boolean;
    hasPower: boolean;
    rating: number;
    website: string;
    phoneNumber: string;
    ratingsTotal: number;
    businessStatus: string;
    businessHours: string[];
    images: Image[];
}
