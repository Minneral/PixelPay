import React from 'react'
import { ButtonPropsType } from '../../types/commonTypes'

export default function Button(props: ButtonPropsType) {

    return (
        <button
            style={{
                fontSize: props.fz,
                paddingTop: props.fz,
                paddingBottom: props.fz,
                paddingRight: props.fz * 2,
                paddingLeft: props.fz * 2,
                fontWeight: props.fw,
                backgroundColor: props.color ? props.color : "",
                width: props.stretch ? "100%" : "",
            }}
            onClick={(e: React.MouseEvent) => { props.callBack() }}
        >
            {props.title}
        </button>
    )
}
