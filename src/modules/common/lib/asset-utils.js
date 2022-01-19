import { assetHttpClient } from './http-client';

export const imageFileUploader = async (options) => {
    const { file, fileName = '', folder = '' } = options;

    const fmData = new FormData();
    const config = {
      headers: { 
        "content-type": "multipart/form-data",
      },
    };
    fmData.append("file", file);
    try {
      const res = await assetHttpClient.post(
        `/upload/image?fileName=${fileName}&folder=${folder}`,
        fmData,
        config
      );
      if (res.status === 201) {
        return res.data;
      }
      return res
    } catch (err) {
      console.error("imageFileUploader error:\n\n", err);
    }
};

export const videoFileUploader = async (options) => {
    const { file, fileName = '', folder = '' } = options;

    const fmData = new FormData();
    const config = {
      headers: { 
        "content-type": "multipart/form-data",
      },
    };
    fmData.append("file", file);
    try {
      const res = await assetHttpClient.post(
        `/upload/video?fileName=${fileName}&folder=${folder}`,
        fmData,
        config
      );
      if (res.status === 201) {
        return res.data;
      }
      return res
    } catch (err) {
      console.error("videoFileUploader error:\n\n", err);
    }
};

export const documentFileUploader = async (options) => {
    const { file, fileName = '', folder = '' } = options;

    const fmData = new FormData();
    const config = {
      headers: { 
        "content-type": "multipart/form-data",
      },
    };
    fmData.append("file", file);
    try {
      const res = await assetHttpClient.post(
        `/upload/document?fileName=${fileName}&folder=${folder}`,
        fmData,
        config
      );
      if (res.status === 201) {
        return res.data;
      }
      return res
    } catch (err) {
      console.error("videoFileUploader error:\n\n", err);
    }
};


  
// export const antdCustomRequestHandler = async (options, params = {}) => {
//   const { onSuccess, onError, file } = options;
//   const { fileName = '', folder = '' } = params;

//   const fmData = new FormData();
//   const config = {
//     headers: { 
//       "content-type": "multipart/form-data",
//     },
//   };
//   fmData.append("file", file);
//   try {
//     const res = await assetHttpClient(
//       `/upload/image?fileName=${fileName}&folder=${folder}`,
//       fmData,
//       config
//     );

//     onSuccess("Ok");
//     console.log("server res: ", res);
//   } catch (err) {
//     console.log("Eroor: ", err);
//     onError({ err });
//   }
// };

// const handleOnChange = ({ file, fileList, event }) => {
//   console.log(file, fileList, event);
//   //Using Hooks to update the state to the current filelist
//   setDefaultFileList(fileList);
//   //filelist - [{uid: "-1",url:'Some url to image'}]
// };