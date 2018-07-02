<?php
/* Copyright (C) NAVER <http://www.navercorp.com> */

/**
 * ConditionGroupTag class
 *
 * @author Arnia Software
 * @package /classes/xml/xmlquery/tags/condition
 * @version 0.1
 */
class ConditionGroupTag
{

	/**
	 * condition list
	 * @var string|array value is ConditionTag object
	 */
	var $conditions;

	/**
	 * pipe
	 * @var string
	 */
	var $pipe;

	/**
	 * constructor
	 * @param string|array $conditions
	 * @param string $pipe
	 * @return void
	 */
	function __construct($conditions, $pipe = 'and')
	{
		$this->pipe = $pipe;

		if(!is_array($conditions))
		{
			$conditions = array($conditions);
		}

		//var_dump($conditions);
		foreach($conditions as $condition)
		{
			if($condition->node_name === 'group')
			{
				$subconditions = $condition->condition;
				$subgroups = $condition->group;
				$subconditions = $subconditions ? (is_array($subconditions) ? $subconditions : [$subconditions]) : [];
				$subgroups = $subgroups ? (is_array($subgroups) ? $subgroups : [$subgroups]) : [];
				$this->conditions[] = new ConditionGroupTag(array_merge($subconditions, $subgroups), $condition->attrs->pipe);
			}
			else
			{
				$this->conditions[] = new ConditionTag($condition);
			}
		}
	}

	function getConditions()
	{
		return $this->conditions;
	}

	/**
	 * ConditionTag object to string
	 * @return string
	 */
	function getConditionGroupString()
	{
		$conditions_string = 'array(' . PHP_EOL;
		foreach($this->conditions as $condition)
		{
			if($condition instanceof ConditionGroupTag)
			{
				$conditions_string .= $condition->getConditionGroupString() . PHP_EOL . ',';
			}
			else
			{
				$conditions_string .= $condition->getConditionString() . PHP_EOL . ',';
			}
		}
		$conditions_string = substr($conditions_string, 0, -2); //remove ','
		$conditions_string .= ')';

		return sprintf("new ConditionGroup(%s%s)", $conditions_string, $this->pipe ? ',\'' . $this->pipe . '\'' : '');
	}

	function getArguments()
	{
		$arguments = array();
		foreach($this->conditions as $condition)
		{
			$arguments = array_merge($arguments, $condition->getArguments());
		}
		return $arguments;
	}

}
/* End of file ConditionGroupTag.class.php */
/* Location: ./classes/xml/xmlquery/tags/condition/ConditionGroupTag.class.php */
