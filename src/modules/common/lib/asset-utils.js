import { assetHttpClient } from './http-client';

const antdCustomRequestHandler = async (options, params = {}) => {
    const { onSuccess, onError, file, onProgress } = options;
    const { fileName = '', folder = '' } = params;

    const fmData = new FormData();
    const config = {
      headers: { 
        "content-type": "multipart/form-data",
      },
    };
    fmData.append("file", file);
    try {
      const res = await assetHttpClient(
        `/upload/image?fileName=${fileName}&folder=${folder}`,
        fmData,
        config
      );

      onSuccess("Ok");
      console.log("server res: ", res);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleOnChange = ({ file, fileList, event }) => {
    console.log(file, fileList, event);
    //Using Hooks to update the state to the current filelist
    setDefaultFileList(fileList);
    //filelist - [{uid: "-1",url:'Some url to image'}]
  };