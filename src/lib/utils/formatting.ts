import { ScoreToSeconds } from './helpers';

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

	if (regexMatch.length >= 7 && regexMatch[6] && regexMatch[6].length === 11) {
		return regexMatch[6];
	}

	return null;
}

export function SecondsToTimeString(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	const secondsFixed = seconds.toFixed(3);

	const minutesString = minutes < 10 ? (minutes === 0 ? '00' : '0' + minutes) : minutes + '';
	const secondsString =
		seconds < 10 ? (seconds === 0 ? '00.000' : '0' + secondsFixed) : secondsFixed;

	return minutesString + ':' + secondsString;
}

export function ScoreToTimeString(score: number | undefined) {
	if (score === undefined) {
		return 'Error No Time';
	}
	const seconds = ScoreToSeconds(score);

	if (seconds === undefined) {
		return 'Error No Time';
	}

	return SecondsToTimeString(seconds);
}
