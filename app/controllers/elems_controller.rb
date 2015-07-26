class ElemsController < ApplicationController
  before_action :set_elem, only: [:show, :edit, :update, :destroy]

  # GET /elems
  # GET /elems.json
  def index
    @elems = Elem.all
  end

  # GET /elems/1
  # GET /elems/1.json
  def show
  end

  # GET /elems/new
  def new
    @elem = Elem.new
  end

  # GET /elems/1/edit
  def edit
  end

  # POST /elems
  # POST /elems.json
  def create
    @elem = Elem.new(elem_params)

    respond_to do |format|
      if @elem.save
        format.html { redirect_to @elem, notice: 'Elem was successfully created.' }
        format.json { render :show, status: :created, location: @elem }
      else
        format.html { render :new }
        format.json { render json: @elem.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /elems/1
  # PATCH/PUT /elems/1.json
  def update
    respond_to do |format|
      if @elem.update(elem_params)
        format.html { redirect_to @elem, notice: 'Elem was successfully updated.' }
        format.json { render :show, status: :ok, location: @elem }
      else
        format.html { render :edit }
        format.json { render json: @elem.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /elems/1
  # DELETE /elems/1.json
  def destroy
    @elem.destroy
    respond_to do |format|
      format.html { redirect_to elems_url, notice: 'Elem was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_elem
      @elem = Elem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def elem_params
      params[:elem].permit([:tag])
    end
end
