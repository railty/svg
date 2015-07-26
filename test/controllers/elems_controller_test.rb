require 'test_helper'

class ElemsControllerTest < ActionController::TestCase
  setup do
    @elem = elems(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:elems)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create elem" do
    assert_difference('Elem.count') do
      post :create, elem: {  }
    end

    assert_redirected_to elem_path(assigns(:elem))
  end

  test "should show elem" do
    get :show, id: @elem
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @elem
    assert_response :success
  end

  test "should update elem" do
    patch :update, id: @elem, elem: {  }
    assert_redirected_to elem_path(assigns(:elem))
  end

  test "should destroy elem" do
    assert_difference('Elem.count', -1) do
      delete :destroy, id: @elem
    end

    assert_redirected_to elems_path
  end
end
