import { CardDescription, CardTitle } from "~components/ui/card";

interface CardHeaderIntroProps {
    title: string,
    description: string
}




export default function CardHeaderIntro({ title, description }: CardHeaderIntroProps) {
    return (
        <>
            <CardTitle
                className="os-text-gradient font-sans uppercase text-transparent text-4xl font-bold"
            >
                {title}
            </CardTitle>
            <CardDescription className="font-mono text-sm text-white">
                {description}
            </CardDescription>
        </>
    )
}