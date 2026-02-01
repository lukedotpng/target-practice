export function FormatMission(mission: string): string {
	const missionStringSplit = mission.split('-');

	for (let i = 0; i < missionStringSplit.length; i++) {
		missionStringSplit[i] = missionStringSplit[i][0].toUpperCase() + missionStringSplit[i].slice(1);
	}

	let formattedMissionString = missionStringSplit.join(' ');

	if (formattedMissionString === 'Three Headed Serpent') {
		formattedMissionString = 'Three-Headed Serpent';
	}

	return formattedMissionString;
}

export function GetYoutubeVideoId(url: string): string | null {
	const regexMatch = url.match(
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
	);
	if (regexMatch === null) {
		return null;
	}

	if (regexMatch.length >= 7 && regexMatch[6]) {
		return regexMatch[6];
	}

	return null;
}
