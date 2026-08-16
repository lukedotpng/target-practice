export function PreventSubmissionOnEnter(
	e: KeyboardEvent & {
		currentTarget: EventTarget & HTMLInputElement;
	}
) {
	if (e.key === 'Enter') e.preventDefault();
}

export function ScoreToSeconds(score: number) {
	// Under 5 min calc
	let seconds = (210000 - score) * (3 / 400);

	if (seconds < 0 || seconds / 60 > 5) {
		// 5 to 15 min calc
		seconds = (175000 - score) * (3 / 50);
	}

	// Less than 0 or more than 15 min
	if (seconds < 0 || seconds > 15 * 60) {
		return undefined;
	}

	return seconds;
}
