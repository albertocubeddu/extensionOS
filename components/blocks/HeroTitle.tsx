interface HeroTitleProps {
    color: string
}

export default function HeroTitle({ color = "white" }: HeroTitleProps) {
    return (
        <>
            <h1 className="text-3xl font-extrabold md:text-5xl lg:text-6xl font-[roboto]" style={{ color }}>
                Extension | OS
            </h1>
        </>
    )
}