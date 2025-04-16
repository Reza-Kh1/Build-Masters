import { useMemo, useRef, useState } from "react";
import JoditEditor, { Jodit } from "jodit-react";
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import { classImg } from "../../data/selectData";
import { toast } from "react-toastify";
import SelectMedia from "../SelectMedia/SelectMedia";
import { FaRegCopy } from "react-icons/fa6";
type EditorType = {
  setEditor: (value: string) => void;
  editor: string;
};
export default function JoditForm({ setEditor, editor }: EditorType) {
  const editorRef = useRef<null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [imgClass, setImgClass] = useState<string[]>([]);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: editor || "شروع به تایپ کنید...",
      uploader: {
        insertImageAsBase64URI: true,
      },
      buttons: [
        ...Jodit.defaultOptions.buttons,
        {
          tooltip: "بازکردن عکس ها",
          name: "images",
          exec: () => {
            setOpen((prev) => !prev);
          },
        },
      ],
    }),
    [editor]
  );
  return (
    <>
      <JoditEditor
        ref={editorRef}
        value={editor}
        config={config}
        onBlur={(newContent) => setEditor(newContent)}
      />
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}

        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          <IconButton onClick={() => setOpen(false)} color="error">
            <IoClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="w-full p-5 flex flex-col gap-16">
            <SelectMedia addMedia={() => { }} />
            <div className="w-full">
              <Autocomplete
                multiple
                fullWidth
                className="shadow-md mb-5"
                id="tags-filled"
                options={classImg.map((option) => option)}
                defaultValue={[]}
                freeSolo
                onChange={(_, newValue) => setImgClass(newValue)}
                value={imgClass}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        variant="outlined"
                        label={option}
                        key={key}
                        {...tagProps}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="کلاس های عکس"
                    placeholder="اینتر بزنید..."
                  />
                )}
              />
              <Button
                color="primary"
                variant="contained"
                className="text-white"
                endIcon={<FaRegCopy />}
                onClick={() => {
                  const gog = imgClass.toString();
                  navigator.clipboard.writeText(gog.replace(/,/g, " "));
                  toast.success("کلاس عکس کپی شد");
                }}>
                کپی کلاس ها
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
