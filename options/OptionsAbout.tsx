import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import CardHeaderIntro from "~components/blocks/CardHeaderIntro"

export default function OptionsAbout() {
    return (
        <div className="grid gap-6 text-lg">
            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Extension | OS"} description={"Extension | OS has been created during the SF Hackaton x Build Club."} />
                </CardHeader>
                <CardContent>
                    It all started a morning on the 27th July 2024
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Mission & Vision"} description={""} />
                </CardHeader>
                <CardContent>
                    Imagine a world where every user has access to powerful large language
                    models (LLMs) directly within their web browser. By integrating LLMs
                    into everyday internet browsing, we can revolutionize the way people
                    interact with information online, providing them with instant,
                    intelligent assistance tailored to their needs.
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Who am I?"} description={""} />
                </CardHeader>
                <CardContent>
                    Visit my{" "}
                    <a
                        className="text-blue-600"
                        href="https://www.linkedin.com/in/alberto-cubeddu/"
                        target="_blank"
                        rel="noopener noreferrer">
                        LinkedIn
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
