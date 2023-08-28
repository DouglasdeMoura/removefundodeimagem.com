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
import { XIcon, Upload as UploadIcon, Loader2 } from "lucide-react";

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
  const [loading, setLoading] = React.useState(false);

  const handleSubmit: SubmitHandler<UploadForm> = async ({ image }) => {
    setLoading(true);

    const removeBg = await loadRemoveBg().then((module) => module.default);

    removeBg(image)
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
          <Button variant="default" size="block" asChild>
            <a href={URL.createObjectURL(processedImage)} download="image.png">
              Baixar
            </a>
          </Button>
          <Button
            variant="secondary"
            size="block"
            onClick={() => {
              setProccessedImage(undefined);
              setFile(undefined);
            }}
          >
            Remover fundo de outra imagem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Upload.Form onSubmit={handleSubmit}>
      <Card className="w-[350px] relative">
        {loading ? (
          <div className="absolute w-full h-full flex justify-center items-center backdrop-blur-sm bg-white/30 rounded-lg z-10">
            <Loader2 className="animate-spin w-10 h-10" />
            <p className="ml-2 text-gray-500">Aguarde...</p>
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
                    className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center"
                  >
                    <UploadIcon className="text-blue-500" />

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
