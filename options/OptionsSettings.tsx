import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { useStorage } from "@plasmohq/storage/hook"
import deepmerge from "deepmerge"
import CardHeaderIntro from "~components/blocks/CardHeaderIntro"
import { Checkbox } from "~components/ui/checkbox"
import { defaultGlobalConfig, setGlobalConfig } from "~lib/configurations/globalConfig"

export default function OptionsSettings() {
    //We're setting to the default if nothing exists.
    let [config] = useStorage("globalConfig", defaultGlobalConfig)
    config = deepmerge(defaultGlobalConfig, config)

    return (
        <div className="grid gap-6 text-lg">
            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Settings"} description={"Customise the look and feel of Extension | OS"} />
                </CardHeader>
                <CardContent>
                    Experience the perfect blend of simplicity and power with our tool—designed to be user-friendly while effortlessly handling complex tasks.
                </CardContent>
            </Card>

            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Selection Menu"} description={"The Selection menu shows when you select a text in any webpage"} />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="display-selection-menu" checked={config.selectionMenu.display}
                            onCheckedChange={(checked) => {
                                const result = checked === true ? true : false
                                setGlobalConfig({
                                    selectionMenu: {
                                        display: result,
                                    }
                                })
                            }} />
                        <label
                            htmlFor="display-selection-menu"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Display Selection Menu when two words are underlined.
                        </label>
                    </div>
                    
                </CardContent>
            </Card>
        </div>
    )
}
