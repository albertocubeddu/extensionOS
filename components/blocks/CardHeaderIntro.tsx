import { CardDescription, CardTitle } from "~components/ui/card";

interface CardHeaderIntroProps {
    title: string,
    description: string
}

const radialGradientExtOs = {
    backgroundImage: 'radial-gradient(circle, #fa5560 -23.47%, #ff66cc 45.52%, #4d91ff 114.8%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    MozBackgroundClip: 'text',
    MozTextFillColor: 'transparent',
};


export default function CardHeaderIntro({ title, description }: CardHeaderIntroProps) {
    return (
        <>
            <CardTitle
                style={radialGradientExtOs}
                className="font-sans uppercase text-transparent text-4xl font-bold"
            >
                {title}
            </CardTitle>
            <CardDescription className="font-mono text-sm text-white">
                {description}
            </CardDescription>
        </>
    )
}