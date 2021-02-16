export type TMeeting= {
    title : string
    theme : string
    meetingDetails: string
}

export type DBMeeting= {
    id: number
} & TMeeting;

export type TUpdateMeeting = {
    title ?: string
    theme ?: string
    meetingDetails?: string
}
