export function PreventFromSubmissionOnEnter(
	e: KeyboardEvent & {
		currentTarget: EventTarget & HTMLInputElement;
	}
) {
	if (e.key === 'Enter') e.preventDefault();
}
