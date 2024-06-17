import ChangelogRender from "./ChangelogRender";

export default function ChangelogsRender({
    changelogs,
    noSection
}) {
    return (
        <>
            {changelogs.map((changelog, index) => {
                return (
                    <ChangelogRender
                        key={index}
                        changelog={changelog}
                        noSection={noSection}
                    />
                )
            })}
        </>
    )
}