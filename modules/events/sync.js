import { readFile, writeFile } from "fs/promises";

const LAST_RUN_PATH = "last_run.json";

async function getSyncEvent() {
	try {
		const data = await readFile(LAST_RUN_PATH);
		return JSON.parse(data);
	} catch (error) {
		console.log("First run");
		return null;
	}
}

async function setSyncEvent(last_synced) {
	const todayRun = {
		last_run: new Date(),
		last_synced: last_synced,
	};
	try {
		await writeFile(LAST_RUN_PATH, JSON.stringify(todayRun));
		console.log("Last Run stored to", LAST_RUN_PATH);
	} catch (error) {
		console.log(error);
	}
}

function excludeSyncedEvents(events, lastSync) {
	const notSynced = events.filter((event) => {
		let valid = true;
		if (lastSync?.last_synced != null) {
			const startTime = new Date(event.start.dateTime);
			const lastSynced = new Date(lastSync?.last_synced);
			valid = startTime.getTime() > lastSynced.getTime();
		}
		return valid;
	});
	return notSynced;
}


export { getSyncEvent, setSyncEvent, excludeSyncedEvents };
