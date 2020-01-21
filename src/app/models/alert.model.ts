export class Alert {
    public type: AlertType;
    public message: string;
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}