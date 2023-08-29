import * as React from "react";
import { SubmitHandler, useForm } from "@modular-forms/react";
import { Input, object, set, special } from "valibot";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components";
import {
  XIcon,
  Upload as UploadIcon,
  Loader2,
  DownloadIcon,
  ArrowLeftIcon,
} from "lucide-react";

const isFile = (input: unknown) => input instanceof File;

const FormSchema = object({
  image: special<File>(isFile),
});

type UploadForm = Input<typeof FormSchema>;

const loadRemoveBg = () => import("@imgly/background-removal");

export const UploadImage: React.FC = () => {
  const [, Upload] = useForm<UploadForm>();
  const [file, setFile] = React.useState<File>();
  const [processedImage, setProccessedImage] = React.useState<Blob>();
  const [dragover, setDragOver] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit: SubmitHandler<UploadForm> = async ({ image }) => {
    setLoading(true);

    const removeBg = await loadRemoveBg().then((module) => module.default);

    removeBg(image ?? file)
      .then((blob) => {
        setProccessedImage(blob);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (processedImage) {
    return (
      <div className="flex flex-col gap-4">
        <img src={URL.createObjectURL(processedImage)} alt="" />
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="block"
            onClick={() => {
              setProccessedImage(undefined);
              setFile(undefined);
            }}
            className="flex gap-2 items-center"
          >
            <ArrowLeftIcon width={16} height={16} />
            <span>Voltar</span>
          </Button>
          <Button variant="default" size="block" asChild>
            <a
              href={URL.createObjectURL(processedImage)}
              download={
                file?.name
                  ? `${file.name.slice(0, -4)}-sem-fundo.png`
                  : "image.png"
              }
              className="flex gap-2 items-center"
            >
              <span>Baixar</span> <DownloadIcon width={16} height={16} />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Upload.Form onSubmit={handleSubmit}>
      <Card className="max-w-screen-sm relative">
        {loading ? (
          <div className="absolute w-full h-full flex justify-center items-center backdrop-blur-sm bg-black/30 rounded-lg z-10">
            <Loader2 className="animate-spin w-10 h-10 text-gray-50 drop-shadow-lg" />
            <p className="ml-2 text-gray-50 drop-shadow-lg">Aguarde...</p>
          </div>
        ) : null}
        <CardHeader>
          <CardTitle>Selecione a imagem</CardTitle>
          <CardDescription>
            Clique ou arraste a imagem que você deseja remover o fundo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Upload.Field name="image" type="File">
            {(field, { onChange, ...props }) => (
              <>
                {file ? (
                  <div className="relative">
                    <Button
                      className="absolute top-2 right-2"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setFile(undefined);
                      }}
                      aria-label="Remover imagem"
                    >
                      <XIcon />
                    </Button>
                    <img src={URL.createObjectURL(file)} alt="" />
                  </div>
                ) : null}
                <div hidden={Boolean(file)}>
                  <label
                    htmlFor={field.name}
                    className={`mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed ${
                      dragover ? "border-blue-400" : "border-gray-400"
                    } bg-white p-6 text-center`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => {
                      setDragOver(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);

                      if (e.dataTransfer.items) {
                        [...e.dataTransfer.items].forEach((item) => {
                          if (item.kind === "file") {
                            const file = item.getAsFile();

                            if (file) {
                              setFile(file);
                            }
                          }
                        });
                      } else {
                        [...e.dataTransfer.files].forEach((file) => {
                          if (file) {
                            setFile(file);
                          }
                        });
                      }
                    }}
                  >
                    <UploadIcon
                      className={`${
                        dragover ? "text-blue-500" : "text-blue-400"
                      }`}
                    />

                    <p className="mt-2 text-gray-500 tracking-wide">
                      Arraste uma imagem ou clique para selecionar
                    </p>

                    <input
                      className="hidden"
                      accept="image/png, image/jpeg"
                      id={field.name}
                      type="file"
                      required
                      onChange={(e) => {
                        onChange?.(e);
                        setFile(e.target.files?.[0]);
                      }}
                      {...props}
                    />
                    {field.error && <div>{field.error}</div>}
                  </label>
                </div>
              </>
            )}
          </Upload.Field>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" size="block" disabled={!file}>
            Remover fundo
          </Button>
        </CardFooter>
      </Card>
    </Upload.Form>
  );
};
