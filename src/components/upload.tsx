import * as React from "react";

import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components";

export const Upload: React.FC = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Selecione a imagem</CardTitle>
        <CardDescription>
          Clique ou arraste a imagem que você deseja remover o fundo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <label
          htmlFor="dropzone-file"
          className="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>

          <p className="mt-2 text-gray-500 tracking-wide">
            Arraste uma imagem ou clique para selecionar
          </p>

          <input id="dropzone-file" type="file" className="hidden" />
        </label>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button size="block">Remover fundo</Button>
      </CardFooter>
    </Card>
  );
};
