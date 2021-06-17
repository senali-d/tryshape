import React, { useState, useEffect } from "react";

// dynamic from Next.js
import dynamic from "next/dynamic";

// modal
import Modal from "react-bootstrap/Modal";

// button
import Button from "react-bootstrap/Button";

// Clip-Path
const Shape = dynamic(import("react-clip-path"), { ssr: false });

// Toast
import toast from "react-hot-toast";

// html-to-image
import { toPng, toJpeg, toSvg, toCanvas } from "html-to-image";

// downloadjs
import download from "downloadjs";

// misc utilities
import { getShapeId } from "../../utils/misc";

// Radios
import { Radios } from "..";

const ExportShape = ({ show, setShow, shape }) => {
  console.log({ shape });
  const [exportType, setExportType] = useState();

  useEffect(() => {
    setExportType('png');
  }, [show])

  const handleTypeChange = (event) => {
    const { value } = event.target;

    console.log(`selected export type ${value}`);
    setExportType(value);
  };

  const doExport = (id, name) => {
    console.log(`Save as ${exportType}`);
    switch (exportType) {
      case "png":
        exportAsPNG(id, name);
        break;
      case "jpeg":
        exportAsJPEG(id, name);
        break;
      case "svg":
        exportAsSVG(id, name);
        break;
      default:
        exportAsPNG(id, name);
        break;
    }
  };

  const exportAsPNG = (id, name) => {
    toPng(document.getElementById(id)).then(function (dataUrl) {
      console.log(dataUrl);
      download(dataUrl, `${name}.png`);
      toast.success(`${name}.png has been exported sucessfully!`);
    });
  };

  const exportAsJPEG = (id, name) => {
    toJpeg(document.getElementById(id), { quality: 0.95 }).then(function (
      dataUrl
    ) {
      console.log(dataUrl);
      download(dataUrl, `${name}.jpeg`);
      toast.success(`${name}.jpeg has been exported sucessfully!`);
    });
  };
  const exportAsSVG = (id, name) => {
    toSvg(document.getElementById(id)).then(function (dataUrl) {
      console.log(dataUrl);
      download(dataUrl, `${name}.svg`);
      toast.success(`${name}.svg has been exported sucessfully!`);
    });
  };
  return (
    <>
      {shape && (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          show={show}
          onHide={() => setShow(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Export {shape.name} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Shape
                name={shape.name}
                formula={shape.formula}
                width="300px"
                height="300px"
                backgroundColor={shape.backgroundColor}
                id={getShapeId(shape.name, true)}
              />
            </div>
            <div>
              <Radios
                groupName="export-type"
                heading="Export as:"
                options={[
                  { value: "png", displayValue: "png" },
                  { value: "jpeg", displayValue: "jpeg" },
                  { value: "svg", displayValue: "svg" },
                ]}
                selectedOption={exportType}
                onValueChange={handleTypeChange}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              onClick={() => doExport(getShapeId(shape.name, true), shape.name)}
            >
              Export
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ExportShape;
