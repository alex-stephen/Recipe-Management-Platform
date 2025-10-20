import { useRouter } from 'next/router';
import TopNavBar from '../../components/navBar/TopNavBar';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import { useEffect, useState } from 'react';
import { Recipe } from '../../types/recipe';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Divider,
  Upload,
  message,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const UNIT_OPTIONS = ['pcs', 'g', 'kg', 'tsp', 'tbsp', 'ml', 'L', 'full', '1/2'];

const RecipeList: React.FC = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [modalVisible, setModalVisible ] = useState(false);
    const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [form] = Form.useForm();

    const showModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };
    
    const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const newRecipe = {
        name: values.name,
        description: values.description,
        ingredients,
        steps,
        imageUrls: (values.photos || []).map((f: any) => f.name),
      };

      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });

      if (res.ok) {
        const created = await res.json();
        setRecipes([...recipes, created]);
        message.success('Recipe added successfully!');
        form.resetFields();
        setIngredients([]);
        setSteps([]);
        setModalVisible(false);
      } else {
        message.error('Failed to save recipe');
      }
    } catch (err) {
      console.error(err);
      message.error('Please fix validation errors.');
    }
  };

    useEffect(() => {
        async function fetchRecipes() {
            const res = await fetch('/api/recipes');
            const data = await res.json();
            setRecipes(data);
        }

        fetchRecipes();
    }, []);

     const addIngredient = () => {
        const { ingredientName, ingredientQuantity, ingredientUnit } = form.getFieldsValue();
        if (!ingredientName || !ingredientQuantity) return;
        setIngredients([
        ...ingredients,
        { name: ingredientName, quantity: `${ingredientQuantity} ${ingredientUnit || ''}`.trim() },
        ]);
        form.resetFields(['ingredientName', 'ingredientQuantity', 'ingredientUnit']);
    };

    const addStep = () => {
        const { currentStep } = form.getFieldsValue();
        if (!currentStep) return;
        setSteps([...steps, currentStep]);
        form.resetFields(['currentStep']);
    };
    return (
        <>
        <TopNavBar />
        <div className="flex items-center justify-center mt-5">
            <Button 
                type='primary' 
                icon={<PlusOutlined />} 
                size='large' className='w-100' 
                onClick={showModal}
            >
                Add Recipe
            </Button>
        </div>
        <Modal
         title="Insert Recipe Information"
         closable={{ 'aria-label': 'Insert Recipe Information' }}
         open={modalVisible}
         onOk={handleOk}
         onCancel={handleCancel}
         width='80%'
         style={{ maxWidth: '768px' }}
         >
        <Form form={form} layout="vertical" name="recipeForm">
                <Form.Item
                    name="name"
                    label="Recipe Name"
                    rules={[{ required: true, message: 'Please enter a recipe name' }]}
                >
                    <Input placeholder="Enter recipe name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                >
                    <Input.TextArea rows={3} placeholder="Describe your recipe" />
                </Form.Item>

                <Divider>Ingredients</Divider>

                {/* Ingredient Input Fields */}
                <Space.Compact block>
                    <Form.Item name="ingredientName" noStyle>
                    <Input placeholder="Ingredient name" />
                    </Form.Item>
                    <Form.Item name="ingredientQuantity" noStyle>
                    <Input placeholder="Quantity" style={{ width: '30%' }} />
                    </Form.Item>
                    <Form.Item name="ingredientUnit" noStyle>
                    <Select placeholder="Units" allowClear style={{ width: '25%' }}>
                        <Option value="">none</Option>
                        {UNIT_OPTIONS.map(unit => (
                        <Option key={unit} value={unit}>
                            {unit}
                        </Option>
                        ))}
                    </Select>
                    </Form.Item>
                    <Button onClick={addIngredient}>+ Add</Button>
                </Space.Compact>

                {/* Ingredient list display */}
                {ingredients.length > 0 && (
                    <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                    {ingredients.map((ing, i) => (
                        <li key={i}>
                        {ing.name} — {ing.quantity}
                        </li>
                    ))}
                    </ul>
                )}

                <Divider>Steps</Divider>

                <Form.Item name="currentStep" label="Add Step">
                    <Input.TextArea rows={2} placeholder="Enter step" />
                </Form.Item>

                <Button onClick={addStep}>+ Add Step</Button>

                {steps.length > 0 && (
                    <ol style={{ marginTop: 10, paddingLeft: 25 }}>
                    {steps.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                    </ol>
                )}

                <Divider>Upload Photos</Divider>

                <Form.Item
                    name="photos"
                    label="Upload Images"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                    <Upload beforeUpload={() => false} listType="picture" multiple>
                        <Button icon={<UploadOutlined />}>Select Images</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 justify-items-center ml-5 mr-5">
            {recipes &&
                recipes.map((recipe, index) => (
                    <RecipeCard key={recipe.id ?? index} recipe={recipe} />
                ))
            }
        </div>
        </>
    );
};

export default RecipeList