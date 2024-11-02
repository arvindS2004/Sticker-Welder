"use client";
import { useState, useEffect, useRef } from "react";
import Layout from "./layout";
import AddText from "./AddText";
import AddEmoji from "./AddEmoji";
import html2canvas from "html2canvas";

const Page = () => {
    const [image, setImage] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({
        width: "auto",
        height: "auto",
    });
    const [text, setText] = useState("");
    const [inputText, setInputText] = useState("");
    const [boxSize, setBoxSize] = useState({ width: 150, height: 50 });
    const [boxVisible, setBoxVisible] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [boxPosition, setBoxPosition] = useState({ x: 50, y: 50 });
    const [textColor, setTextColor] = useState("#000000"); // Color picker state
    const [isBold, setIsBold] = useState(false); // Bold toggle state
    const [fontFamily, setFontFamily] = useState("Arial"); // Font family state
    const [emojis, setEmojis] = useState([]);
    const imgRef = useRef();
    const boxRef = useRef();
    const inputRef = useRef();
    const isDragging = useRef(false);
    const stickerRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setBoxVisible(false);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.width,
                height: imgRef.current.height,
            });
        }
    }, [image]);

    const handleResizeMouseDown = (e) => {
        e.preventDefault();
        const startWidth = boxRef.current.clientWidth;
        const startHeight = boxRef.current.clientHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (e) => {
            setBoxSize({
                width: Math.max(startWidth + (e.clientX - startX), 50),
                height: Math.max(startHeight + (e.clientY - startY), 20),
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const toggleBox = () => setBoxVisible(!boxVisible);

    const adjustFontSize = (adjustment) =>
        setFontSize((prev) => Math.max(prev + adjustment, 2));

    const handleBoxMouseDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        const startX = e.clientX - boxPosition.x;
        const startY = e.clientY - boxPosition.y;

        const handleMouseMove = (e) => {
            if (isDragging.current) {
                setBoxPosition({
                    x: e.clientX - startX,
                    y: e.clientY - startY,
                });
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const applyText = () => {
        setText(inputText);
        setInputText("");
        setBoxVisible(true);
    };

    const handleAddEmoji = (emoji) => {
        setInputText((prevText) => prevText + emoji);
        inputRef.current.focus();
    };

    const handleDownload = async () => {
        const stickerArea = stickerRef.current;
        if (!stickerArea) return;

        // Temporarily adjust the size of the sticker area to fit the uploaded image exactly
        stickerArea.style.width = `${imgRef.current.naturalWidth}px`;
        stickerArea.style.height = `${imgRef.current.naturalHeight}px`;

        const canvas = await html2canvas(stickerArea, {
            width: imgRef.current.naturalWidth,
            height: imgRef.current.naturalHeight,
            x: imgRef.current.offsetLeft,
            y: imgRef.current.offsetTop,
            scrollX: 0,
            scrollY: 0,
        });

        // Reset the sticker area dimensions back to original values after capture
        stickerArea.style.width = imageDimensions.width;
        stickerArea.style.height = imageDimensions.height;

        // Convert canvas to an image and trigger download
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "sticker.png";
        link.click();
    };

    const handleReplaceImage = () => {
        document.getElementById("file-input").click();
    };

    const toggleBold = () => setIsBold((prev) => !prev);

    const handleFontChange = (e) => {
        setFontFamily(e.target.value);
    };

    return (
        <Layout>
            <div className="container">
                <div
                    className="sticker-area"
                    ref={stickerRef}
                    style={{
                        width: imageDimensions.width,
                        height: imageDimensions.height,
                    }}
                >
                    {image && (
                        <img
                            src={image}
                            alt="Uploaded"
                            className="uploaded-image"
                            ref={imgRef}
                        />
                    )}
                    {boxVisible && (
                        <div
                            style={{
                                position: "absolute",
                                top: `${boxPosition.y}px`,
                                left: `${boxPosition.x}px`,
                                width: `${boxSize.width}px`,
                                height: `${boxSize.height}px`,
                            }}
                            onMouseDown={handleBoxMouseDown}
                        >
                            <input
                                type="text"
                                value={text}
                                placeholder="nice"
                                ref={boxRef}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border:'none',
                                    background:'none',
                                    fontSize: `${fontSize}px`,
                                    color: textColor,
                                    fontWeight: isBold ? "bold" : "normal",
                                    fontFamily: fontFamily,
                                    textAlign: "center",
                                    padding: "5px",
                                    cursor:'move'
                                }}
                                readOnly
                            />
                            <div
                                className="resizer"
                                onMouseDown={handleResizeMouseDown}
                                style={{
                                    width: "5px",
                                    height: "5px",
                                    borderRadius:'50%',
                                    backgroundColor: "white",
                                    position: "absolute",
                                    right: "0",
                                    bottom: "0",
                                    cursor: "nwse-resize",
                                }}
                            />
                        </div>
                    )}
                    {emojis.map((emojiData, index) => (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                top: `${emojiData.position.y}px`,
                                left: `${emojiData.position.x}px`,
                                fontSize: "24px",
                                cursor: "move",
                            }}
                        >
                            {emojiData.emoji}
                        </div>
                    ))}
                    <input                    
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                        style={{ display: image ? "none" : "block" }}
                    />
                </div>

                {image && (<>
                      
                    <div className="text-input-section-container">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Add something"
                            
                        /> <AddEmoji onSelectEmoji={handleAddEmoji} />
                    
                        <button onClick={applyText}>OK</button>
                        <div> 
                            <AddText
                      textareaVisible={boxVisible}
                      toggleTextarea={toggleBox}
                      increaseFontSize={() => adjustFontSize(2)}
                      decreaseFontSize={() => adjustFontSize(-2)}
                      image={image}
                       
                        
                  /> </div>
                  
                        </div>
                        <div>
                       
                       
                        <div className="font-controls">
                    <label>
                        Font Color: 
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </label>
                    <button className="bol" onClick={toggleBold}>{isBold ? "Unbold" : "Bold"}</button>
                    <select className="sel" onChange={handleFontChange} value={fontFamily}>
                        <option className="oppi" value="Arial">Arial</option>
                        <option className="oppi" value="Courier New">Courier New</option>
                        <option className="oppi" value="Georgia">Georgia</option>
                        <option className="oppi" value="Times New Roman">Times New Roman</option>
                        <option className="oppi" value="Verdana">Verdana</option>
                        <option className="oppi" value="Monospace">Monospace</option>
                    </select>
                </div>
                       
                    </div>
                    </>
                )}

                {image && (
                    <div className="download-section">
                       <button className="rep" onClick={handleReplaceImage}>Replace Image</button>
                        <button className="downo" onClick={handleDownload}>Download Sticker</button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Page;
