import { useTranslation } from "react-i18next";

export const getTimePast = (date: Date, t: any): string => {
    const currentDate: Date = new Date();
    const millisecondsInDay: number = 1000 * 60 * 60 * 24;

    const pastTimeSecond: number = currentDate.getTime() - date.getTime();
    const pastTimeDate: number = pastTimeSecond / millisecondsInDay;
    if (pastTimeDate < 30) {
        if (pastTimeDate < 1) {
            return `${"recently"}`;
        }

        return `${Math.floor(pastTimeDate)} ${t("day")}`;
    } else if (pastTimeDate < 365) {
        const month: number = Math.floor(pastTimeDate / 30);

        return `${month} ${t("month")}`;
    } else {
        const year: number = Math.floor(pastTimeDate / 365);

        return `${year} ${t("year")}`;
    }
};

export const formatDate = (
    value: Date | string,
    formatting: Intl.DateTimeFormatOptions = {
        month: "numeric",
        day: "numeric",
        year: "numeric",
    }
) => {
    if (!value) return value;

    return Intl.DateTimeFormat("vi-VN", formatting).format(new Date(value));
};

export const formatTimeAgo = (
    createdAt: string,
    t: (key: string) => string
): string => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInSeconds = Math.floor(
        (now.getTime() - createdDate.getTime()) / 1000
    );

    const secondsInMinute = 60;
    const secondsInHour = 60 * secondsInMinute;
    const secondsInDay = 24 * secondsInHour;
    const secondsInWeek = 7 * secondsInDay;
    const secondsInMonth = 30 * secondsInDay;
    const secondsInYear = 365 * secondsInDay;

    if (diffInSeconds >= secondsInYear) {
        return `${Math.floor(diffInSeconds / secondsInYear)} ${t("year")}`;
    } else if (diffInSeconds >= secondsInMonth) {
        return `${Math.floor(diffInSeconds / secondsInMonth)} ${t("month")}`;
    } else if (diffInSeconds >= secondsInWeek) {
        return `${Math.floor(diffInSeconds / secondsInWeek)} ${t("week")}`;
    } else if (diffInSeconds >= secondsInDay) {
        return `${Math.floor(diffInSeconds / secondsInDay)} ${t("day")}`;
    } else if (diffInSeconds >= secondsInHour) {
        return `${Math.floor(diffInSeconds / secondsInHour)} ${t("hour")}`;
    } else if (diffInSeconds >= secondsInMinute) {
        return `${Math.floor(diffInSeconds / secondsInMinute)} ${t("minute")}`;
    } else {
        return t("just_now");
    }
};
// Ví dụ sử dụng:
