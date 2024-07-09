import { Range } from "react-range";
// https://www.npmjs.com/package/react-range

export default function name({
    state,
    setState
}) {
    return <Range
        min={-5}
        max={5}
        step={1}
        values={state}
        onChange={(values) => setState(values)}
        renderTrack={({ props, children }) => (
            <div
                {...props}
                style={{
                    ...props.style,
                    height: "6px",
                    width: "90%",
                    borderRadius: "var(--border-radius)",
                    backgroundColor: "var(--border-input)"
                }}
            >
                {children}
            </div>
        )}
        renderThumb={({ props }) => (
            <div
                {...props}
                style={{
                    ...props.style,
                    width: "var(--button-img)",
                    height: "var(--button-img)",
                    transition: ".2s all",
                    borderRadius: "50%",
                    backgroundColor: state[0] === 0 ? "var(--range-thumb)" : (state[0] > 0 ? "var(--border-input-focus)" : "var(--border-input-error)")
                }}
            >
                <div
                    style={{
                        width: "var(--button-img)",
                        height: "var(--button-img)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        position: "absolute",
                        top: "0px",
                        left: "0px",

                        fontWeight: "500",
                        color: "var(--text-white)",
                        fontSize: "var(--p)",
                    }}
                >
                    {state[0] > 0 ? `+${state[0]}` : state[0]}
                </div>   
            </div>
        )}
        renderMark={({ props, index }) => (
            <div
                {...props}
                style={{
                    ...props.style,
                    height: "16px",
                    width: "6px",
                    borderRadius: "var(--border-radius)",
                    backgroundColor: index < 5 ? "var(--border-input-error)" : (index > 5 ? "var(--border-input-focus)" : "var(--range-thumb)")
                }}
            />
        )}
    />
}