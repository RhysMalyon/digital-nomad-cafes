export const setOpenStatus = (
    businessHours: google.maps.places.PlaceOpeningHoursPeriod
) => {
    const today = new Date();
    const day = today.getDay();
    const hour = today.getHours();
    const minute = today.getMinutes();

    if (businessHours.close) {
        if (businessHours.open.day === day && businessHours.close.day >= day) {
            if (
                hour > businessHours.open.hours &&
                hour < businessHours.close.hours
            ) {
                return true;
            } else if (
                hour === businessHours.close.hours &&
                minute < businessHours.close.minutes
            ) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        // Open 24 hours
        return true;
    }
};
