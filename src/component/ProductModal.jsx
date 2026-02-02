function ProductModal({
  modalType,
  templateData,
  onCloseModal,
  onInputChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
  onUpdateProduct,
  onDeleteProduct,
}) {

  return (
   <div
  className="modal fade"
  id="productModal"
  tabIndex="-1"
  aria-hidden="true"
>
  <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div className="modal-content border-0 shadow-lg rounded-4">
      {/* Header */}
      <div
        className={`modal-header py-3 ${
          modalType === "delete" ? "bg-danger" : "bg-dark"
        } text-white`}
      >
        <h5 className="modal-title fw-semibold">
          {modalType === "delete"
            ? "刪除產品"
            : modalType === "edit"
            ? "編輯產品"
            : "新增產品"}
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="modal"
        />
      </div>

      {/* Body */}
      <div className="modal-body">
        {modalType === "delete" ? (
          <div className="alert alert-danger text-center mb-0">
            <h5 className="mb-3">⚠️ 刪除確認</h5>
            <p className="mb-0">
              確定要刪除
              <span className="fw-bold mx-1">
                {templateData.title}
              </span>
              嗎？
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {/* 左側圖片區 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3">產品圖片</h6>

                  <div className="mb-3">
                    <label className="form-label small text-muted">
                      主圖網址
                    </label>
                    <input
                      type="text"
                      id="imageUrl"
                      className="form-control"
                      value={templateData.imageUrl}
                      onChange={onInputChange}
                    />
                  </div>

                  {templateData.imageUrl && (
                    <div className="ratio ratio-1x1 mb-3">
                      <img
                        src={templateData.imageUrl}
                        alt="主圖"
                        className="rounded border object-fit-cover"
                      />
                    </div>
                  )}

                  {templateData.imagesUrl.map((image, index) => (
                    <div key={index} className="mb-3">
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2"
                        value={image}
                        onChange={(e) =>
                          onImageChange(index, e.target.value)
                        }
                        placeholder={`副圖 ${index + 1}`}
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid rounded border"
                        />
                      )}
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-2">
                    {templateData.imagesUrl.length < 5 &&
                      templateData.imagesUrl[
                        templateData.imagesUrl.length - 1
                      ] !== "" && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm flex-fill"
                          onClick={onAddImage}
                        >
                          新增圖片
                        </button>
                      )}
                    {templateData.imagesUrl.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={onRemoveImage}
                      >
                        移除圖片
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 右側表單區 */}
            <div className="col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3">產品資訊</h6>

                  <div className="mb-3">
                    <label className="form-label">標題</label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      value={templateData.title}
                      onChange={onInputChange}
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">分類</label>
                      <input
                        id="category"
                        className="form-control"
                        value={templateData.category}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">單位</label>
                      <input
                        id="unit"
                        className="form-control"
                        value={templateData.unit}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label className="form-label">原價</label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        value={templateData.origin_price}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">售價</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        value={templateData.price}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <hr />

                  <div className="mb-3">
                    <label className="form-label">產品描述</label>
                    <textarea
                      id="description"
                      className="form-control"
                      rows="4"
                      value={templateData.description}
                      onChange={onInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">說明內容</label>
                    <textarea
                      id="content"
                      className="form-control"
                      rows="4"
                      value={templateData.content}
                      onChange={onInputChange}
                    />
                  </div>

                  <div className="form-check form-switch">
                    <input
                      id="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      checked={templateData.is_enabled}
                      onChange={onInputChange}
                    />
                    <label className="form-check-label">
                      啟用此產品
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="modal-footer border-0 pt-0">
        <button
          type="button"
          className="btn btn-outline-secondary me-auto"
          data-bs-dismiss="modal"
          onClick={onCloseModal}
        >
          取消
        </button>

        {modalType === "delete" ? (
          <button
            type="button"
            className="btn btn-danger px-4"
            onClick={() => onDeleteProduct(templateData.id)}
          >
            刪除
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary px-4"
            onClick={() => onUpdateProduct(templateData.id)}
          >
            確認
          </button>
        )}
      </div>
    </div>
  </div>
</div>


  );
}

export default ProductModal;