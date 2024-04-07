import { UserBrowserState } from "@/lib/store";
import { File, Folder, User, X, Zap } from "lucide-react";
import { Button } from "../ui/button";

const KBD = ({ ...props }) => {
    return (
        <kbd {...props} className="pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100" />
    );
}

export default KBD;

export const Mentions = () => {
    const { userState: { selected_A_Contacts, selected_A_Directory, selected_A_Files }, clearState } = UserBrowserState()
    return (
        <div className="flex items-center border border-dashed m-2 px-3 py-2 flex-row gap-2">
            <KBD>
                User State <Zap className="w-3 fill-white" />
            </KBD>
            {selected_A_Contacts?.map(c => (<KBD key={c}>
                <User className="w-3 fill-white" /> {c}
            </KBD>))}
            {selected_A_Files?.map(c => (<KBD key={c}>
                <File className="w-3 fill-white" />
                {c}
            </KBD>))}
            {selected_A_Directory && <KBD>
                <Folder className="w-3 fill-white" />
                {selected_A_Directory.directory}
            </KBD>}

            <div className="ms-auto" />
            <Button variant={"secondary"} size={"sm"} className="rounded-xs"
                onClick={() => clearState()}>
                <X className="w-3 fill-white" />
            </Button>
        </div>
    );
}