import {ActionType} from "@ant-design/pro-components";

declare namespace CommonType {
    interface IProps {
        actionRef: React.MutableRefObject<ActionType | undefined>
        id: string
        setDrawerVisible: (visible: boolean) => void
    }
}
