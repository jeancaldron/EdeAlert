import fetch from "node-fetch";
import cheerio from "cheerio";

const getMaintenances = async () => {
	const response = await fetch(
		"https://www.edesur.com.do/enlaces-empresa/informacion-al-cliente/mantenimientos-programados/"
	);
	const body = await response.text();

	const $ = cheerio.load(body);

	const daysOfWeek = new Map();
	daysOfWeek.set("enero", 0);
	daysOfWeek.set("febrero", 1);
	daysOfWeek.set("marzo", 2);
	daysOfWeek.set("abril", 3);
	daysOfWeek.set("mayo", 4);
	daysOfWeek.set("junio", 5);
	daysOfWeek.set("julio", 6);
	daysOfWeek.set("agosto", 7);
	daysOfWeek.set("septiembre", 8);
	daysOfWeek.set("octubre", 9);
	daysOfWeek.set("noviembre", 10);
	daysOfWeek.set("diciembre", 11);

	const convertTime12to24 = (time12h) => {
		const [time, modifier] = time12h.split(" ");

		let [hours, minutes] = time.split(":");

		if (hours === "12") {
			hours = "00";
		}

		if (modifier === "p.m.") {
			hours = parseInt(hours, 10) + 12;
		}

		return `${hours}:${minutes}`;
	};

	let maintenances = [];

	const days = $(".day-text");
	days.each((index, dayNode) => {
		const dateTexts = $(dayNode)
			.contents()
			.first()
			.text()
			.trim()
			.replace(".", "")
			.replace(",", "")
			.split(" ");

		const year = parseInt(dateTexts[10]);
		const month = daysOfWeek.get(dateTexts[9]);
		const day = parseInt(dateTexts[7]);

		let maintenance = {
			date: new Date(year, month, day),
			provinces: [],
		};

		const provincesNodes = $(dayNode).find(".accordeon-item");
		provincesNodes.each((index, provinceNode) => {
			const provinceText = $(provinceNode).find("h4").text().trim();

			let province = {
				nombre: provinceText,
				schedules: [],
			};

			const schedulesNodes = $(provinceNode).find(".card-body");
			schedulesNodes.each((index, scheduleNode) => {
				let schedules = [];

				$(scheduleNode)
					.find("h5")
					.each((index, h5Node) => {
						const scheduleText = $(h5Node).text().trim().split(" ");
						const desde = parseInt(
							convertTime12to24(
								`${scheduleText[3]} ${scheduleText[4] + scheduleText[5]}`
							)
						);
						const hasta = parseInt(
							convertTime12to24(
								`${scheduleText[7]} ${scheduleText[8] + scheduleText[9]}`
							)
						);
						schedules.push({
							desde: new Date(year, month, day, desde),
							hasta: new Date(year, month, day, hasta),
						});
					});
				$(scheduleNode)
					.find("p")
					.each((index, pNode) => {
						const neighborhoodsTexts = $(pNode).text().trim().split(", ");
						schedules[index].neighborhoods = neighborhoodsTexts
					});

				province.schedules = schedules;
			});

			maintenance.provinces.push(province);
		});

		maintenances.push(maintenance);
	});

	return maintenances;

};

export { getMaintenances };
