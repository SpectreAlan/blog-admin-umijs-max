import {ActionType} from "@ant-design/pro-components";

declare namespace CommonType {
    interface IProps {
        actionRef?: React.MutableRefObject<ActionType | undefined>
        id: string
        type?: string
        setDrawerVisible: (visible: boolean) => void
        onChange?: (params: File.FileItem) => void
    }
}
