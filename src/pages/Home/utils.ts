import dayjs from "dayjs";

export interface IPropsStatistics {
    start: string
    end: string
    type: string
}

const getRangeByDays = (days: number): IPropsStatistics => {
    const today = dayjs();
    const startOfLastSevenDays = today.subtract(days - 1, 'day').startOf('day');
    const endOfLastWeek = today.endOf('day');
    return {start: startOfLastSevenDays.format('YYYY-MM-DD'), end: endOfLastWeek.format('YYYY-MM-DD'), type: 'day'};
}

const getRangeByMonth = (month: number): IPropsStatistics => {
    const today = dayjs();
    const startOfThreeMonthsAgo = today.subtract(month, 'month').startOf('month');
    const endOfToday = today.endOf('day');
    return {start: startOfThreeMonthsAgo.format('YYYY-MM-DD'), end: endOfToday.format('YYYY-MM-DD'), type: 'month'};
}

export const rangesByDay = [
    {
        title: '近7天',
        fun: (): IPropsStatistics => {
            return getRangeByDays(7)
        }
    },
    {
        title: '近15天',
        fun: (): IPropsStatistics => {
            return getRangeByDays(15)
        }
    },
    {
        title: '近30天',
        fun: (): IPropsStatistics => {
            return getRangeByDays(30)
        }
    }
]

export const rangesByMonth = [
    {
        title: '本月',
        fun: (): IPropsStatistics => {
            const today = dayjs();
            const startOfCurrentMonth = today.startOf('month');
            const endOfToday = today.endOf('day');
            return {start: startOfCurrentMonth.format('YYYY-MM-DD'), end: endOfToday.format('YYYY-MM-DD'), type: 'day'};
        }
    },
    {
        title: '上月',
        fun: (): IPropsStatistics => {
            const today = dayjs();
            const startOfLastMonth = today.subtract(1, 'month').startOf('month');
            const endOfLastMonth = today.subtract(1, 'month').endOf('month');
            return {start: startOfLastMonth.format('YYYY-MM-DD'), end: endOfLastMonth.format('YYYY-MM-DD'), type: 'day'};
        }
    },
    {
        title: '近三月',
        fun: (): IPropsStatistics => {
            return getRangeByMonth(3);
        }
    },
    {
        title: '近半年',
        fun: (): IPropsStatistics => {
            return getRangeByMonth(6);
        }
    },
    {
        title: '近一年',
        fun: (): IPropsStatistics => {
            return getRangeByMonth(12);
        }
    }
]