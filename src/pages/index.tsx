import React, { useCallback, useState, useRef, useEffect } from "react";
import { Table, Input, Button, Upload, InputRef } from "antd";
import {
  getDiagonalNumberArray,
  getHorizontalNumberArray,
  getVerticalNumberArray,
} from "../helpers";

const ECO_VALUE = "E";

const InputTable = () => {
  // const listDataDefault = dataSample?.data?.map((ele) =>
  //   ele?.map((x) => x?.map((y) => y?.toString()))
  // );
  const inputRef = useRef<InputRef>(null);
  const listDataDefault = useRef(null);
  const [listData, setListData] = useState<any>([]);
  const [valueInput, setValueInput] = useState<any>("");

  useEffect(() => {
    const jsonData = localStorage.getItem("json_data");
    const valueInput = localStorage.getItem("value_input");
    if (jsonData) {
      setListData(JSON.parse(jsonData));
      listDataDefault.current = JSON.parse(jsonData);
    }
    if (valueInput) {
      setValueInput(valueInput);
    }
  }, []);

  const handleChangeBingoNumber = (e) => {
    const regex = /^[0-9,]*$/;
    if (regex.test(e.target.value)) {
      setValueInput(e.target.value);
      localStorage.setItem("value_input", e.target.value?.trim());
      if (!e.target.value?.trim()) {
        setListData(listDataDefault.current);
        return;
      }
      const numberBingoArr = [ECO_VALUE, ...e.target.value?.split(",")]?.map(
        (x) => x?.trim()
      );
      const newListData = listDataDefault?.current?.filter((ele) => {
        const horizontalArray = ele;
        const verticalArray = getVerticalNumberArray(ele);
        const diagonalArray = getDiagonalNumberArray(ele);
        const isExistInHorizontalArray = horizontalArray?.some((x) =>
          x?.every((y) => numberBingoArr?.includes(y))
        );
        const isExistInVerticalArray = verticalArray?.some((x) =>
          x?.every((y) => numberBingoArr?.includes(y))
        );
        const isExistInDiagonalArrayArray = diagonalArray?.some((x) =>
          x?.every((y) => numberBingoArr?.includes(y))
        );
        return !!(
          isExistInHorizontalArray ||
          isExistInVerticalArray ||
          isExistInDiagonalArrayArray
        );
      });
      setListData(newListData);
    }
  };

  const numberArr = [ECO_VALUE, ...valueInput?.split(",")]?.map((x) =>
    x?.trim()
  );

  const handleFileRead = (event) => {
    const content = event.target.result;
    try {
      const jsonData = JSON.parse(content);
      listDataDefault.current = jsonData?.data;
      setListData(jsonData?.data);
      localStorage.setItem("json_data", JSON.stringify(jsonData?.data));
    } catch (e) {}
  };

  const handleFileChosen = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div className="mx-4">
      <div>
        <div className="mb-1 mt-2 text-lg">
          Bước 1: Tải file json: (Chưa có thì export tại{" "}
          <a className="text-blue-500 underline" href="/export">
            đây
          </a>
          )
        </div>
        <Upload
          beforeUpload={(file) => {
            handleFileChosen(file);
            return false;
          }}
          accept=".json"
          onRemove={() => {
            listDataDefault.current = null;
            setListData([]);
            const jsonData = localStorage.getItem("json_data");
            if (jsonData) {
              localStorage.removeItem("json_data");
            }
          }}
          maxCount={1}
          defaultFileList={[]}
        >
          <Button>Select JSON File</Button>
        </Upload>
      </div>
      <div className="mt-4 text-lg">Bước 2: Vui lòng nhập dãy số Bingo</div>
      <div className="text-sm mb-2">
        ⚠️ Lưu ý: Chỉ nhập số và mỗi số ngăn cách nhau bởi dấu ","
      </div>
      <Input.TextArea
        ref={inputRef}
        value={valueInput}
        onChange={handleChangeBingoNumber}
        placeholder="Nhập dãy số Bingo"
        onFocus={() => {
          inputRef.current!.focus({
            cursor: "end",
          });
        }}
        autoSize={true}
      />
      <div className="flex flex-row items-center justify-between mt-5 mb-2">
        <div className="text-lg">{`Kết quả: ${listData?.length || 0}/${
          listDataDefault?.current?.length || 0
        }`}</div>
        <Button
          className="mr-10"
          onClick={() => setListData(listDataDefault.current)}
          type="primary"
        >
          Show all
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 items-center">
        {listData?.map((ele, idx) => (
          <div>
            <span className="flex justify-center text-xl mb-1 font-bold">{`Bingo ${
              listDataDefault.current?.findIndex(
                (x) => JSON.stringify(x) === JSON.stringify(ele)
              ) + 1
            }`}</span>
            <Table
              showHeader={false}
              key={idx}
              dataSource={ele?.map((data, eleIdx) => ({
                key: eleIdx,
                name: data,
              }))}
              columns={ele.map((_, colIndex) => ({
                dataIndex: colIndex,
                key: colIndex,
                render: (_, record, rowIndex) => {
                  const isMiddleCell = rowIndex === 2 && colIndex === 2;
                  if (isMiddleCell) {
                    return (
                      <span className="flex w-full bg-red-600 text-white justify-center">
                        {ECO_VALUE}
                      </span>
                    );
                  }
                  if (numberArr?.includes(ele[rowIndex][colIndex])) {
                    return (
                      <div className="flex w-full bg-red-600 text-white justify-center">
                        {ele[rowIndex][colIndex]}
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex justify-center">
                        {ele[rowIndex][colIndex]}
                      </div>
                    );
                  }
                },
              }))}
              pagination={false}
              bordered
              size="middle"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputTable;
