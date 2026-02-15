export function PreventSubmissionOnEnter(
	e: KeyboardEvent & {
		currentTarget: EventTarget & HTMLInputElement;
	}
) {
	if (e.key === 'Enter') e.preventDefault();
}
