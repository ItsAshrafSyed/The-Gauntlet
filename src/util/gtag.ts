import { Url } from "url";
import { GA_TRACKING_ID } from "./constants";

export type TrackingEventArgs = {
	action: String;
	category: String;
	label: String;
	value: number;
};

declare var window: any;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: Url) => {
	window.gtag("config", GA_TRACKING_ID, {
		page_path: url,
	});
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
	action,
	category,
	label,
	value,
}: TrackingEventArgs) => {
	window.gtag("event", action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
