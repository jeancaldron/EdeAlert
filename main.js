import { getMaintenances } from "./modules/edesur/maintenance.js";
import { getSyncEvent, setSyncEvent, excludeSyncedEvents } from "./modules/events/sync.js";
import { getEventsFromMaintenances } from "./modules/events/parse.js";
import { createEvent } from "./modules/calendar/gcal.js";

const lastSync = await getSyncEvent();

const maintenances = await getMaintenances()

const renacimientoEvents = getEventsFromMaintenances(maintenances, "Distrito Nacional", "Renacimiento");
const cacicazgosEvents = getEventsFromMaintenances(maintenances, "Distrito Nacional", "Cacicazgos");

const events = renacimientoEvents.concat(cacicazgosEvents);

const pendingEvents = excludeSyncedEvents(events,lastSync);

pendingEvents.forEach((event) => {
	// createEvent(event);
});

setSyncEvent(maintenances[maintenances.length - 1].date);